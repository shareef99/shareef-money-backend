import { PartialType } from "@nestjs/mapped-types";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";
import { CategoryType, categoryTypes } from "src/categories/categories.model";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(categoryTypes)
  type: CategoryType;

  @IsNumber()
  @IsPositive()
  user_id: number;
}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
