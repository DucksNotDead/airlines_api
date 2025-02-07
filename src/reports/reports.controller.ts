import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from '../../shared/decorators/roles.method';
import { TicketsByCompanyAndMonthDto } from './dto/tickets-by-company-and-month.dto';
import { CompaniesService } from '../companies/companies.service';
import { TicketsByCompanyAndMonthResponse } from './responses/tickets-by-company-and-month.response';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Roles('Admin')
  @Post('/tickets-by-company-and-month')
  async ticketsByCompanyAndMonth(
    @Body() dto: TicketsByCompanyAndMonthDto,
  ): Promise<TicketsByCompanyAndMonthResponse> {
    const company_name = await this.companiesService.findNameByCode(
      dto.company_code,
    );

    if (!company_name) {
      throw new BadRequestException('Company not found');
    }

    const tickets = await this.reportsService.ticketsByCompanyAndMonth(dto);

    return { company_name, tickets };
  }
}
