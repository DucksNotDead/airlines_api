import {IsOptional, IsString} from "class-validator";

export class UpdateCompanyDto {
	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	address: string;
}
