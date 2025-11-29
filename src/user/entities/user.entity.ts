import { IsEnum } from "class-validator";
import { Column, DataType, Model, Table } from "sequelize-typescript";
import { CreateApiDto } from "src/apis/dto/create-api.dto";

@Table
export class User extends Model<User, CreateApiDto> {
  @Column
  username: string;
  @Column
  email: string;
  @Column
  password: string;
  @Column({ defaultValue: true })
  isActive: boolean
  @Column({
    type: DataType.ENUM('admin', 'user'), 
    defaultValue: "user"
  })
  @IsEnum(['admin, user'])
  role: string
}
