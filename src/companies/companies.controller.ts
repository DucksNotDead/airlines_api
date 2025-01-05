import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {Roles} from "../../shared/decorators/roles.method";

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Roles('Admin')
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Roles('Admin')
  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(code, updateCompanyDto);
  }

  @Roles('Admin')
  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.companiesService.remove(code);
  }
}
