import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  buy_date: string;

  @IsOptional()
  @IsNumber()
  type_id: number;

  @IsOptional()
  @IsNumber()
  cash_desk_id: number;

  @IsOptional()
  @IsNumber()
  cashier_id: number;

  @IsOptional()
  @IsString()
  company_code: string;
}
