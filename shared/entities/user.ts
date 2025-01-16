import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../types';

export class UserCredits {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

export class User {
  id: number;
  login: string;
  role: UserRole;
}

export class CreateUserDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  login: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
