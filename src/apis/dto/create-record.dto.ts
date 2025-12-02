import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLogDto {
  @ApiProperty({description: "client's host", example: "192.168.1.1"})
  @IsString()
  ip: string
  @ApiProperty({description: "endpoint that client's hit", example: '/api/transaction'})
  @IsString()
  endpoint: string
}