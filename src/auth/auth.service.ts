import { Injectable, Logger, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

import { loginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { jwtPayload } from 'src/common/types';


@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}
  
  async login(dto: loginDto) {
    try {
      let user = await this.validateUser(dto)      
      const payload: jwtPayload = {
        userId: user.id,
        username: user.username,
        role: user.role
      };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw error
    }
  }
  
  private async validateUser(dto: loginDto) {
    let user: any
    if (isEmail(dto.emailOrUsername)) {
      user = await this.userService.findByEmail(dto.emailOrUsername);
    } else {
      user = await this.userService.findByUsername(dto.emailOrUsername);
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (!user.password) {
      throw new NotFoundException('User has no password set');
    }
    
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }
    
    if (!await bcrypt.compare(dto.password, user.password)) {
      throw new NotFoundException('Invalid password');
    }
    return user
  }

  async generateAdminUser() {
    const pass = await bcrypt.hash('administrator', 10)
    const userData = {
      username: "administrator",
      email: "admin@mail.com",
      password: pass,
      role: "admin"
    }   
    try {
      await this.userService.createUser(userData)
      this.logger.log("User admin created")
    } catch (error) {
      this.logger.error(error.message)
    }  
  }

  onModuleInit() {
    this.generateAdminUser()
  }
}
