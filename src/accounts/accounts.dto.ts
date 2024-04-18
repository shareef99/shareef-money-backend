import { PartialType } from "@nestjs/mapped-types";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";
import { IsNullable } from "src/common/utils/is-nullable.decorator";

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNullable()
  description: string;

  @IsBoolean()
  is_hidden: boolean;

  @IsNumber()
  @IsPositive()
  user_id: number;
}
export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
