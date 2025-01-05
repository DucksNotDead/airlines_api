import { IsNumber, IsString } from 'class-validator';

export class CreateCashierDto {
  @IsNumber()
  user_id: number;

  @IsString()
  fio: string;
}
