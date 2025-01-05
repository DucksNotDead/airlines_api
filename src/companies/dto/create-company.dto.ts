import { IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(2, 3)
  code: string;

  @IsString()
  name: string;

  @IsString()
  address: string;
}
