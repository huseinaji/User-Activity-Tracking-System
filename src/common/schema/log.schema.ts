import { Column, Model, Table } from "sequelize-typescript";

@Table({
  timestamps: true,
  underscored: true,
  indexes: [
    {fields: ['api_key']},
    {fields: ['created_at'], unique: true}
  ]
})
export class Log extends Model {
  @Column
  declare apiKey: string
  @Column
  declare ip: string
  @Column
  declare endpoint: string
}