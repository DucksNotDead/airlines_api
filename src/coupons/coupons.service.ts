import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class CouponsService {
  constructor(private readonly dbService: DbService) {}

  create({ route, rate, ticket_id }: CreateCouponDto) {
    return this.dbService.queryItem(
      `
      INSERT INTO coupons (route, rate, ticket_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [route, rate, ticket_id],
    );
  }

  remove(id: number) {
    return this.dbService.queryItem(
      `
      DELETE FROM coupons
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );
  }
}
