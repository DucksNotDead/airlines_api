import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CouponDto } from '../../shared/entities/coupon';

@Injectable()
export class CouponsService {
  constructor(private readonly dbService: DbService) {}

  getByTicketId(ticketId: number) {
    return this.dbService.query<CouponDto>(
      `
      SELECT * FROM coupons
      WHERE ticket_id = $1
      `,
      [ticketId]
    )
  }

  create({ ticket_id, index, from, to, rate }: CouponDto) {
    return this.dbService.queryItem<CouponDto>(
      `
      INSERT INTO coupons (index, "from", "to", rate, ticket_id)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
      `,
      [index, from, to, rate, ticket_id],
    );
  }

  update({ id, index, from, to, rate }: CouponDto) {
    return this.dbService.queryItem<CouponDto>(
      `
      UPDATE coupons 
      SET index = $1, "from" = $2, "to" = $3, rate = $4
      WHERE id = $5
      RETURNING *
      `,
      [index, from, to, rate, id],
    );
  }

  remove(id: number) {
    return this.dbService.queryItem<number>(
      `
      DELETE FROM coupons
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );
  }
}
