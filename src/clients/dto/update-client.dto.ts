import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsNumber()
  passport: number;

  @IsOptional()
  @IsString()
  fio: string;

  @IsOptional()
  @IsNumber()
  user_id: number;
}
