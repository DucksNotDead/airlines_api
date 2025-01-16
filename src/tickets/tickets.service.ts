import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { DbService } from '../db/db.service';
import { TTicketStatus } from '../../shared/types';
import { UpdateTicketDto } from './dto/update-ticket-dto';
import { CouponsService } from '../coupons/coupons.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly dbService: DbService,
    private readonly couponsService: CouponsService,
  ) {}

  async create({ type_id, company_code, coupons }: CreateTicketDto) {
    if (!coupons.length) {
      return null;
    }

    const ticket = await this.dbService.queryItem<{ id: number }>(
      `
      INSERT INTO tickets (type_id, company_code, status_id)
      VALUES ($1, $2, 1)
      RETURNING *
      `,
      [type_id, company_code],
    );

    for (const couponIndex in coupons) {
      const coupon = coupons[couponIndex];
      coupon.index = Number(couponIndex) + 1;
      coupon.ticket_id = ticket.id;
      await this.couponsService.create(coupon);
    }

    return ticket;
  }

  findAll(status?: TTicketStatus, clientId?: number) {
    let query = `SELECT
    t.id, t.buy_date,
    (
        SELECT row_to_json(tt)
        FROM ticket_types tt
        WHERE tt.id = t.type_id
    ) AS type,
    row_to_json(status) AS status,
    (
        SELECT row_to_json(c)
        FROM companies c
        WHERE c.code = t.company_code
    ) AS company,
    (
        SELECT coalesce(json_agg(json_build_object(
                                 'id', cpn.id,
                                 'index', cpn.index,
                                 'from', cpn.from,
                                 'to', cpn.to,
                                 'rate', cpn.rate
                                 )), '[]')
        FROM coupons cpn
        WHERE cpn.ticket_id = t.id
    ) AS coupons,
    (
        SELECT row_to_json(cash)
        FROM cashiers cash
        WHERE cash.id = t.cashier_id
    ) AS cashier,
    (
        SELECT row_to_json(cd)
        FROM cash_desks cd
        WHERE cd.id = t.cash_desk_id
    ) AS cash_desk,
    json_build_object(
               'id', client.id,
               'passport', client.passport,
               'fio', client.fio
               ) AS client
FROM tickets t
LEFT JOIN ticket_statuses status ON status.id = t.status_id
LEFT JOIN LATERAL (
    SELECT cl.*
    FROM coupons cpn
    LEFT JOIN clients cl on cl.id = cpn.client_id
    WHERE cpn.ticket_id = t.id
    LIMIT 1
) AS client ON TRUE
WHERE 1 = 1`;
    const params: any[] = [];

    if (clientId) {
      query += ' AND client.id = $1';
      params.push(clientId);
    }

    if (status) {
      query += ' AND status.code = $1';
      params.push(status);
    }

    return this.dbService.query(query, params);
  }

  findById(id: number) {
    return this.dbService.queryItem(`SELECT * FROM tickets WHERE id = $1`, [
      id,
    ]);
  }

  async update(
    id: number,
    { type_id, company_code, coupons }: UpdateTicketDto,
  ) {
    await this.dbService.queryItem(
      `
      UPDATE tickets 
      SET type_id = $1, company_code = $2
      WHERE id = $3
      `,
      [type_id, company_code, id],
    );

    const oldCoupons = await this.couponsService.getByTicketId(id);

    for (const oldCoupon of oldCoupons) {
      if (!coupons.find((c) => c.id === oldCoupon.id)) {
        await this.couponsService.remove(oldCoupon.id);
      }
    }

    for (const couponIndex in coupons) {
      const coupon = coupons[couponIndex];
      coupon.index = Number(couponIndex) + 1;
      if (!!coupon.id) {
        await this.couponsService.update(coupon);
      } else {
        coupon.ticket_id = id;
        await this.couponsService.create(coupon);
      }
    }
  }

  remove(id: number) {
    return this.dbService.queryItem(
      `
      DELETE FROM tickets 
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );
  }

  buy(id: number, clientId: number) {
    return this.dbService.queryItem(
      `
      BEGIN;
      
      UPDATE tickets
      SET status_id = 2
      WHERE id = $2;
      
      UPDATE coupons
      SET client_id = $1
      WHERE ticket_id = $2;
      
      COMMIT:
      `,
      [clientId, id],
    );
  }

  confirm(id: number) {
    return this.dbService.queryItem(
      `
      UPDATE tickets
      SET status_id = 3
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );
  }

  deny(id: number) {
    return this.dbService.queryItem(
      `
      BEGIN;
      
      UPDATE tickets
      SET status_id = 1
      WHERE id = $1;
      
      UPDATE coupons
      SET client_id = null
      WHERE ticket_id = $1;
      
      COMMIT;      
      `,
      [id],
    );
  }

  getTypes() {
    return this.dbService.query('SELECT * FROM ticket_types');
  }

  getStatuses() {
    return this.dbService.query('SELECT * FROM ticket_statuses');
  }
}
