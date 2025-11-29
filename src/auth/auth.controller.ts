import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  register(@Body() dto: SignUpDto) {
    this.authService.signup(dto)
  }

  @Post('login')
  login(@Body() dto: loginDto) {
    this.authService.login(dto)
  }
}
