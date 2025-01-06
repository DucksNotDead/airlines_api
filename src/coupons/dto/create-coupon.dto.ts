import {IsNumber, IsString} from "class-validator";

export class CreateCouponDto {
	@IsString()
	route: string;

	@IsNumber()
	rate: number;

	@IsNumber()
	ticket_id: number;
}
