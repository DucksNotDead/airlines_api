import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class ReportsService {
  constructor(private readonly dbService: DbService) {}

  ticketsByCompanyAndMonth(company_code: string, month: number, year: number) {
    return this.dbService.query(
      `
      SELECT t.id, t.buy_date, (
          SELECT row_to_json(tt)
          FROM ticket_types tt
          WHERE tt.id = t.type_id
          ) as type,
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
          ) AS client
      FROM tickets t
      WHERE t.company_code = $1 AND t.buy_date ILIKE '%.' || lpad($2::TEXT, 2, '0') || '.' || $3::TEXT
      `,
      [company_code, month, year],
    );
  }

  totalAmountOfEachCompany() {
    return this.dbService.query(
      `
      SELECT c.*, coalesce((
          SELECT sum(cpn.rate)
          FROM tickets t
          LEFT JOIN coupons cpn ON cpn.ticket_id = t.id
          WHERE t.company_code = c.code AND t.status_id = 3
          ), 0) as total
      FROM companies c
      `,
    );
  }

  clientsOfEachCompanyByDate(day: number, month: number, year: number) {
    return this.dbService.query(
      `
      SELECT c.*, coalesce((
          SELECT json_agg((
              SELECT row_to_json(cl)
              FROM clients cl
              WHERE cl.id = client_id
          ))
          FROM tickets t
          LEFT JOIN LATERAL (
              SELECT cpn.client_id
              FROM coupons cpn
              WHERE cpn.ticket_id = t.id
              LIMIT 1
          ) client_id ON TRUE
          WHERE t.company_code = c.code AND client_id IS NOT NULL AND t.buy_date = $1
      ), '[]') AS clients
      FROM companies c
      `,
      [`${day}.${month}.${year}`],
    );
  }
}
