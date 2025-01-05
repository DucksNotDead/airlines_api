import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsNumber()
  passport: number;

  @IsString()
  fio: string;

  @IsOptional()
  @IsNumber()
  user_id: number;
}
