import { IsNumber, IsString } from 'class-validator';

export class TicketsByCompanyAndMonthDto {
  @IsString()
  company_code: string;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;
}