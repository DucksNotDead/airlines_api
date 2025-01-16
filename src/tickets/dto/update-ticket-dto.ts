import {IsArray, IsNumber, IsOptional, IsString} from 'class-validator';
import {CouponDto} from "../../../shared/entities/coupon";

export class UpdateTicketDto {
  @IsOptional()
  @IsNumber()
  type_id: number;

  @IsOptional()
  @IsString()
  company_code: string;

  @IsOptional()
  @IsArray()
  coupons: CouponDto[];
}
