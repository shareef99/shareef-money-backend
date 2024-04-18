import { PartialType } from "@nestjs/mapped-types";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";
import { IsNullable } from "src/common/utils/is-nullable.decorator";
import {
  Transaction,
  TransactionType,
  transactionTypes,
} from "src/transactions/transactions.model";

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  user_id: string;

  @IsNumber()
  @IsPositive()
  account_id: string;

  @IsNumber()
  @IsPositive()
  category_id: string;

  @IsNumber()
  @IsPositive()
  sub_category_id: string;

  @IsEnum(transactionTypes)
  type: TransactionType;

  @IsString()
  @IsNullable()
  notes: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  transaction_at: number;
}
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export type DailyTransaction = {
  transaction_at: string; // Change the data type according to your needs
  total_income: number;
  total_expense: number;
  transactions: Transaction[];
};
