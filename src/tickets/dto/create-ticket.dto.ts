import {IsArray, IsNumber, IsString} from "class-validator";
import {CouponDto} from "../../../shared/entities/coupon";

export class CreateTicketDto {
	@IsNumber()
	type_id: number;

	@IsString()
	company_code: string;

	@IsArray()
	coupons: CouponDto[];
}
