import { Injectable } from '@nestjs/common';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { DbService } from '../db/db.service';
import { Cashier } from '../../shared/entities/cashier';

@Injectable()
export class CashiersService {
  constructor(private readonly dbService: DbService) {}

  create({ user_id, fio }: CreateCashierDto) {
    return this.dbService.queryItem(
      `
      INSERT INTO cashiers (user_id, fio) 
      VALUES ($1, $2)
      RETURNING *
      `,
      [user_id, fio],
    );
  }

  findAll() {
    return this.dbService.query('SELECT * FROM cashiers');
  }

  findByUserId(user_id: number) {
    return this.dbService.queryItem<Cashier>(
      'SELECT * FROM cashiers WHERE user_id = $1',
      [user_id],
    );
  }

  update(id: number, { user_id, fio }: UpdateCashierDto) {
    return this.dbService.queryItem(
      `
      UPDATE cashiers
      SET user_id = $1, fio = $2
      WHERE id = $3
      RETURNING *
      `,
      [user_id, fio, id],
    );
  }

  remove(id: number) {
    return this.dbService.queryItem(
      `
      DELETE FROM cashiers 
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );
  }
}
