import {IsString} from "class-validator";

export class CashDeskDto {
	@IsString()
	address: string;
}
