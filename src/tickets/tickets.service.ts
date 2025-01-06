import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { DbService } from '../db/db.service';
import { TTicketStatus } from '../../shared/types';
import { UpdateTicketDto } from './dto/update-ticket-dto';

@Injectable()
export class TicketsService {
  constructor(private readonly dbService: DbService) {}

  create({ type_id, company_code }: CreateTicketDto) {
    return this.dbService.queryItem(
      `
      INSERT INTO tickets (type_id, company_code, status_id)
      VALUES ($1, $2, 1)
      RETURNING *
      `,
      [type_id, company_code],
    );
  }

  findAll(status?: TTicketStatus, clientId?: number) {
    let query = `SELECT
    t.id, t.buy_date,
    (
        SELECT row_to_json(tt)
        FROM ticket_types tt
        WHERE tt.id = t.type_id
    ) as type,
    (
        SELECT row_to_json(st)
        FROM ticket_statuses st
        WHERE st.id = status_id
    ) as status
    (
        SELECT row_to_json(c)
        FROM companies c
        WHERE c.code = t.company_code
    ) as company,
    (
        SELECT coalesce(json_agg(json_build_object(
                                 'id', cpn.id,
                                 'route', cpn.route,
                                 'rate', cpn.rate
                                 )), '[]')
        FROM coupons cpn
        WHERE cpn.ticket_id = t.id
    ) as coupons,
    (
        SELECT row_to_json(cash)
        FROM cashiers cash
        WHERE cash.id = t.cashier_id
    ) as cashier,
    (
        SELECT row_to_json(cd)
        FROM cash_desks cd
        WHERE cd.id = t.cash_desk_id
    ) as cash_desk,
    (
        SELECT json_build_object(
               'id', cl.id,
               'passport', cl.passport,
               'fio', cl.fio
               )
        FROM coupons cpn
        LEFT JOIN clients cl on cl.id = cpn.client_id
        WHERE cpn.ticket_id = t.id
        LIMIT 1
    ) as client
FROM tickets t
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

  update(id: number, { type_id, company_code }: UpdateTicketDto) {
    return this.dbService.queryItem(
      `
      UPDATE tickets 
      SET type_id = $1, company_code = $2
      WHERE id = $3
      RETURNING *
      `,
      [type_id, company_code, id],
    );
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
