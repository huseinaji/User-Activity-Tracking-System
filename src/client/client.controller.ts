import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientRegisterDto } from './dto/client-register.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('api')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({summary: "Register a new client (store client_id, name, email, api_key)"})
  @Post('register')
  register(@Body() dto: ClientRegisterDto) {
    return this.clientService.register(dto)
  }

  @ApiOperation({summary: "Get all client's, only admin can do the operation"})
  @UseGuards(AuthGuard, AdminGuard)
  @Get('findAllClient')
  findAllClient(){
    return this.clientService.findAllClient()
  }
}
