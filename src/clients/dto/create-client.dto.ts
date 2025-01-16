import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  passport: string;

  @IsString()
  fio: string;

  @IsOptional()
  @IsNumber()
  user_id?: number;
}
