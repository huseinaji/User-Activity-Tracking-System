
import { nanoid } from "nanoid";
import { Column, DataType, Default, Index, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  timestamps: true,
  underscored: true,
})
export class Client extends Model {
  @PrimaryKey
  @Default(() => nanoid(24))
  @Column({
    type: DataType.STRING
  })
  declare clientId: string
  @Column
  declare name: string;
  @Column
  declare email: string;
  @Column({unique: true})
  declare apiKey: string
}
