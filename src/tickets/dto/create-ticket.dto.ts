import {IsNumber, IsString} from "class-validator";

export class CreateTicketDto {
	@IsString()
	buy_date: string;

	@IsNumber()
	type_id: number;

	@IsNumber()
	cash_desk_id: number;

	@IsNumber()
	cashier_id: number;

	@IsString()
	company_code: string;
}
