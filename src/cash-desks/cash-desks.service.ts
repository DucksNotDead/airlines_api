import { Injectable } from '@nestjs/common';
import { CashDeskDto } from './dto/cash-desk.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class CashDesksService {
  constructor(private readonly dbService: DbService) {}

  create({ address }: CashDeskDto) {
    return this.dbService.queryItem(
      `
      INSERT INTO cash_desks (address)
      VALUES ($1)
      RETURNING *
      `,
      [address],
    );
  }

  findAll() {
    return this.dbService.query(`SELECT * FROM cash_desks`);
  }

  update(id: number, { address }: CashDeskDto) {
    return this.dbService.queryItem(
      `
      UPDATE cash_desks
      SET address = $1
      WHERE id = $2
      RETURNING *
      `,
      [address, id],
    );
  }

  remove(id: number) {
    return this.dbService.queryItem(
      `
      DELETE FROM cash_desks
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );
  }
}
