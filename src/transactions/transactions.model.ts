import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Account } from "src/accounts/accounts.model";
import { Category } from "src/categories/categories.model";
import { SubCategory } from "src/sub-categories/sub-categories.model";
import { User } from "src/users/users.model";

export type TransactionType = "income" | "expense" | "transfer";
export const transactionTypes = ["income", "expense", "transfer"] as const;

@Table({ underscored: true })
export class Transaction extends Model {
  @Column({
    allowNull: false,
    type: DataType.ENUM(...transactionTypes),
  })
  type: TransactionType;

  @Column({ allowNull: true })
  notes: string;

  @Column({ allowNull: false })
  amount: number;

  @Column({ allowNull: false, type: DataType.DATE })
  transaction_at: Date;

  @Column({ allowNull: false })
  @ForeignKey(() => User)
  user_id: number;

  @Column({ allowNull: false })
  @ForeignKey(() => Account)
  account_id: number;

  @Column({ allowNull: false })
  @ForeignKey(() => Category)
  category_id: number;

  @Column({ allowNull: true })
  @ForeignKey(() => SubCategory)
  sub_category_id: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Account)
  account: Account;

  @BelongsTo(() => Category)
  category: Category;

  @BelongsTo(() => SubCategory)
  sub_category: SubCategory;
}
