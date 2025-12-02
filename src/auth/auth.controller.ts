import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, LoginFailNotFoundDto, LoginSuccessResponseDto } from './dto/login.dto';
import { ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: "login, by default only admin user created"})
  @ApiResponse({status: 200, description: 'Login success', type: LoginSuccessResponseDto})
  @ApiResponse({status: 404, description: "incorrect email/username", type: LoginFailNotFoundDto})
  @Post('login')
  login(@Body() dto: loginDto) {
    return this.authService.login(dto)
  }
}
