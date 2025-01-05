import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { DbService } from '../db/db.service';
import { TTicketStatus } from '../../shared/types';

@Injectable()
export class TicketsService {
  constructor(private readonly dbService: DbService) {}

  create({
    buy_date,
    type_id,
    company_code,
    cashier_id,
    cash_desk_id,
  }: CreateTicketDto) {
    return this.dbService.queryItem(
      `
      INSERT INTO tickets (buy_date,type_id,company_code,cashier_id,cash_desk_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [buy_date, type_id, company_code, cashier_id, cash_desk_id],
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
FROM tickets t`;
    const params: any[] = [];

    if (clientId) {
      query += ' WHERE client.id = $1';
      params.push(clientId);
    }

    if (status) {
      query += ' WHERE status.code = $1';
      params.push(status);
    }

    return this.dbService.query(query, params);
  }

  update(
    id: number,
    {
      buy_date,
      type_id,
      company_code,
      cashier_id,
      cash_desk_id,
    }: UpdateTicketDto,
  ) {
    return this.dbService.queryItem(
      `
      UPDATE tickets 
      SET buy_date = $1, type_id = $2, company_code = $3, cashier_id = $4, cash_desk_id = $5
      WHERE id = $6
      RETURNING *
      `,
      [buy_date, type_id, company_code, cashier_id, cash_desk_id],
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
}
