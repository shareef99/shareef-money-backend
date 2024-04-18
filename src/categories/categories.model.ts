import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { SubCategory } from "src/sub-categories/sub-categories.model";
import { User } from "src/users/users.model";

export type CategoryType = "income" | "expense";
export const categoryTypes = ["income", "expense"] as const;

@Table({ underscored: true })
export class Category extends Model {
  @Column({ allowNull: false })
  name: string;

  @Column({
    allowNull: false,
    defaultValue: "expense",
    type: DataType.ENUM(...categoryTypes),
  })
  type: CategoryType;

  @Column({ allowNull: false })
  @ForeignKey(() => User)
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => SubCategory)
  sub_categories: SubCategory[];
}
