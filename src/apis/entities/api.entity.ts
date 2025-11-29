import { Column, Model, Table } from "sequelize-typescript";
import { CreateApiDto } from "../dto/create-api.dto";

@Table
export class Api extends Model<Api, CreateApiDto> {
    @Column
    client_id: string;
    @Column
    name: string;
    @Column
    email: string;
    @Column
    api_key: string;
}
