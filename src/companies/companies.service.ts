import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly dbService: DbService) {}

  create({ code, name, address }: CreateCompanyDto) {
    return this.dbService.queryItem(
      `
      INSERT INTO companies (code, name, address)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [code, name, address],
    );
  }

  findAll() {
    return this.dbService.query('SELECT * FROM companies');
  }

  update(code: string, { name, address }: UpdateCompanyDto) {
    return this.dbService.queryItem(
      `
      UPDATE companies
      SET name = $1, address = $2
      WHERE code = $3
      RETURNING *`,
      [name, address, code],
    );
  }

  remove(code: string) {
    return this.dbService.queryItem(
      `
      DELETE FROM companies
      WHERE code = $1
      RETURNING id`,
      [code],
    );
  }
}
