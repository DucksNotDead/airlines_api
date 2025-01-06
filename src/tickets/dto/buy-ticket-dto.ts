import {IsEmail, IsNumber, IsString, Length} from 'class-validator';

export class BuyTicketDto {
  @IsEmail()
  email: string;

	@IsString()
	fio: string;

  @IsNumber()
  @Length(10, 10)
  passport: string;
}