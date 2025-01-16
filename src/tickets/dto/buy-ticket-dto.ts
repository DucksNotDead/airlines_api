import {IsEmail, IsNumber, IsOptional, IsString, Length} from 'class-validator';

export class BuyTicketDto {
	@IsOptional()
  @IsEmail()
  email: string;

	@IsString()
	fio: string;

  @IsNumber()
  @Length(10, 10)
  passport: string;
}