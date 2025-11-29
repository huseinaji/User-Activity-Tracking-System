import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.userService.findAllUser();
  }
  @UseGuards(AuthGuard)
  @Post()
  delete(@Req() req: Request) {
    return this.userService.deleteUser(req['user']);
  }

  
}
