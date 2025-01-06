import {IsNumber, IsString} from "class-validator";

export class CreateTicketDto {
	@IsNumber()
	type_id: number;

	@IsString()
	company_code: string;
}
