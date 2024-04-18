import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Category } from "src/categories/categories.model";

@Table({ underscored: true })
export class SubCategory extends Model {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  @ForeignKey(() => Category)
  category_id: number;

  @BelongsTo(() => Category)
  category: Category;
}
