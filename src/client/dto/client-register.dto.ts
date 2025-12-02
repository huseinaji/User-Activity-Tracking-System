import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ClientRegisterDto {
  @ApiProperty({description: "client's email", example: 'tes@mail.com'})
  @IsEmail()
  @IsString()
  email: string
  @ApiProperty({description: "client's name", example: 'josh'})
  @IsString()
  name: string
}