import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "src/users/users.model";

@Table({ underscored: true })
export class Account extends Model {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  amount: number;

  @Column({ allowNull: true })
  description: string | null;

  @Column({ defaultValue: false })
  is_hidden: boolean;

  @Column({ allowNull: false })
  @ForeignKey(() => User)
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
