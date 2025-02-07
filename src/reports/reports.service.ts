import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { PdfService } from './pdf.service';
import { TicketsByCompanyAndMonthDto } from './dto/tickets-by-company-and-month.dto';
import {
  TicketByCompanyAndMonth,
  TicketsByCompanyAndMonthResponse,
} from './responses/tickets-by-company-and-month.response';

@Injectable()
export class ReportsService {
  constructor(
    private readonly dbService: DbService,
    private readonly pdfService: PdfService,
  ) {}

  ticketsByCompanyAndMonth({
    company_code,
    month,
    year,
  }: TicketsByCompanyAndMonthDto) {
    return this.dbService.query<TicketByCompanyAndMonth>(
      `
      SELECT t.id, t.buy_date, (
          SELECT row_to_json(tt)
          FROM ticket_types tt
          WHERE tt.id = t.type_id
          ) as type,
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
      [company_code, month, year]
    );
  }

  private totalAmountOfEachCompany() {
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

  private clientsOfEachCompanyByDate(day: number, month: number, year: number) {
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

  // async ticketsByCompanyAndMonthPDF(dto: TicketsByCompanyAndMonthDto) {
  //   const data = await this.ticketsByCompanyAndMonth(dto);
  //
  //   return this.pdfService.genPdfFromData(
  //     `Билеты, проданные ${dto.company_code} за ${dto.month}.${dto.year}`,
  //     data,
  //     {
  //       id: 'ID',
  //       buy_date: 'Дата покупки',
  //       type: [
  //         'Тип билета',
  //         {
  //           id: 'ID',
  //           code: 'Код',
  //           localized: 'Название',
  //         },
  //       ],
  //       client: [
  //         'Клиент',
  //         {
  //           id: 'ID',
  //           fio: 'ФИО',
  //           passport: 'Паспорт',
  //         },
  //       ],
  //       cash_desk: [
  //         'Касса',
  //         {
  //           id: 'ID',
  //           address: 'Адрес',
  //         },
  //       ],
  //       cashier: [
  //         'Кассир',
  //         {
  //           id: 'ID',
  //           fio: 'ФИО',
  //           user_id: 'ID Пользователя',
  //         },
  //       ],
  //       coupons: [
  //         'Купоны',
  //         {
  //           id: 'ID',
  //           index: 'Порядковый номер',
  //           from: 'Откуда',
  //           to: 'Куда',
  //           rate: 'Стоимость',
  //         },
  //       ],
  //     },
  //   );
  // }
}
