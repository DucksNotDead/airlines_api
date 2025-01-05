import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCashierDto {
  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsString()
  fio: string;
}
