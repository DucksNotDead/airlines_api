import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  passport: string;

  @IsOptional()
  @IsString()
  fio: string;

  @IsOptional()
  @IsNumber()
  user_id: number;
}
