import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsNumber()
  type_id: number;

  @IsOptional()
  @IsString()
  company_code: string;
}
