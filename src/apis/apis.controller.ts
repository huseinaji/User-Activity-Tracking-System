import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApisService } from './apis.service';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';

@Controller('api')
export class ApisController {
  constructor(private readonly apisService: ApisService) {}

  @Post('register')
  create(@Body() createApiDto: CreateApiDto) {
    return this.apisService.create(createApiDto);
  }

  @Post('logs')
  recordApi(){
    return this.apisService.recordApi();
  }

  @Get('usage/daily')
  getDailyUsage(){
    return this.apisService.getDaylyUsage();
  }

  @Get('usage/top')
  getTopApis(){
    return this.apisService.getTopApis();
  }

  @Get()
  findAll() {
    return this.apisService.findAll();
  }
}
