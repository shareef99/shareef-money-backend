import { Column, Model, Table } from "sequelize-typescript";

@Table
export class User extends Model {
  // Accounts       []Account     `json:"accounts" gorm:"foreignKey:UserID;constraints:OnDelete:SET NULL"`
  // Categories     []Category    `json:"categories" gorm:"foreignKey:UserID;constraints:OnDelete:SET NULL"`
  // Transactions   []Transaction `json:"transactions" gorm:"foreignKey:UserID;constraints:OnDelete:SET NULL"`
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false, unique: true })
  email: string;

  @Column({ allowNull: true, unique: true })
  mobile: string;

  @Column({ allowNull: false, defaultValue: "inr" })
  currency: string;

  @Column({ allowNull: false, defaultValue: 1 })
  month_start_date: number;

  @Column({ allowNull: false, defaultValue: "mon" })
  week_start_day: string;

  @Column({ allowNull: false, unique: true })
  refer_code: string;

  @Column({ defaultValue: true })
  is_active: boolean;
}
