import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEmail,
  IsOptional,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  mobile: string | null;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  currency: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  month_start_date: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  week_start_day: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class SigninDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
