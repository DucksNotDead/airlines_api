import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class ClientsService {
  constructor(private readonly dbService: DbService) {}

  create({ passport, fio, user_id }: CreateClientDto) {
    return this.dbService.queryItem(
      `
      INSERT INTO clients (passport, fio, user_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
      `,
      [passport, fio, user_id],
    );
  }

  findAll() {
    return this.dbService.query('SELECT * FROM clients');
  }

  update(id: number, { passport, fio, user_id }: UpdateClientDto) {
    return this.dbService.queryItem(
      `
      UPDATE clients 
      SET passport = $1, fio = $2, user_id = $3
      WHERE id = $4
      RETURNING *
      `,
      [passport, fio, user_id, id],
    );
  }

  remove(id: number) {
    return this.dbService.queryItem(
      `
      DELETE FROM clients 
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );
  }
}
