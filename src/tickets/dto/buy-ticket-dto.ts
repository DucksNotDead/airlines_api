import {IsEmail, IsNumber, IsOptional, IsString, Length} from 'class-validator';

export class BuyTicketDto {
  @IsString()
  email: string;

	@IsString()
	fio: string;

  @IsString()
  @Length(10, 10)
  passport: string;
}