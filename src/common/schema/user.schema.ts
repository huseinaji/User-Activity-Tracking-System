import { IsEnum } from "class-validator";
import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  timestamps: true,
  underscored: true
})
export class User extends Model {
  @Column({unique: true})
  declare username: string
  @Column({unique: true})
  declare email: string;
  @Column
  declare password: string;
  @Column({ defaultValue: true })
  declare isActive: boolean
  @IsEnum(['admin, user'])
  @Column({
    type: DataType.ENUM('admin', 'user'), 
    defaultValue: "user",
    allowNull: false
  })
  declare role: string
}
