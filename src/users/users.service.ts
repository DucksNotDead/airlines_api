import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserCredits,
} from '../../shared/entities/user';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  create({ login, password, role }: CreateUserDto) {
    return this.dbService.queryItem<User>(
      `
      INSERT INTO users (login, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, login, role
      `,
      [login, password, role],
    );
  }

  findAll() {
    return this.dbService.query<User>(
      `
      SELECT id, login, role 
      FROM users
      `,
    );
  }

  findById(id: number) {
    return this.dbService.queryItem<User>(
      `
      SELECT u.id, u.login, u.role 
      FROM users u
      WHERE u.id = $1
      `,
      [id],
    );
  }

  findByLogin(login: string) {
    return this.dbService.queryItem<User>(
      `
      SELECT u.id, u.login, u.role
      FROM users u
      WHERE u.login = $1
      `,
      [login],
    );
  }

  findByCredits({ login, password }: UserCredits) {
    return this.dbService.queryItem<User>(
      `
      SELECT u.id, u.login, u.role 
      FROM users u
      WHERE u.login = $1 AND u.password = $2
      `,
      [login, password],
    );
  }

  update(id: number, { login, password, role }: UpdateUserDto) {
    return this.dbService.queryItem<User>(
      `
      UPDATE users 
      SET login = $1, password = $2, role = $3,
      WHERE id = $4
      RETURNING id, login, role
      `,
      [login, password, role, id],
    );
  }

  remove(id: number) {
    return this.dbService.queryItem(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );
  }
}
