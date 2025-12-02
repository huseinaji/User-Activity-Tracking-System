import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class loginDto {
  @ApiProperty({description: 'user can use email or username for login', example:"John"})
  @IsString()
  emailOrUsername: string;
  @ApiProperty({description: 'password', example: "john123"})
  @IsString()
  password: string;
}

export class LoginSuccessResponseDto {
  @ApiProperty()
  access_token: string
}

export class LoginFailNotFoundDto {
  @ApiProperty({example: "Invalid password"})
  message: string;
  @ApiProperty({example: "Not Found"})
  error: string;
  @ApiProperty({example: 404})
  statusCode: number;
}
