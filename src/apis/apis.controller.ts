import { Controller, Get, Post, UseGuards, Req, Body } from '@nestjs/common';
import { ApisService } from './apis.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { CreateLogDto } from './dto/create-record.dto';
import { ApiKeyGuard } from 'src/common/guards/api.guard';
import { RatelimitGuard } from 'src/common/guards/ratelimit.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api')
export class ApisController {
  constructor(private readonly apisService: ApisService) {}

  @ApiOperation({summary: "Record an API hit (includes api_key, ip, endpoint, and timestamp)"})
  @UseGuards(ApiKeyGuard, RatelimitGuard)
  @Post('logs')
  recordApi(@Req() req: Request, @Body() data: CreateLogDto){
    return this.apisService.recordApi(req, data);
  }

  @ApiOperation({summary: "Fetch total daily requests per client for the last 7 days"})
  @UseGuards(AuthGuard)
  @Get('usage/daily')
  getDailyUsage(){
    return this.apisService.getDaylyUsage();
  }

  @ApiOperation({summary: "Fetch top 3 clients with the highest total requests in the last 24 hours"})
  @UseGuards(AuthGuard)
  @Get('usage/top')
  getTopApis(){
    return this.apisService.getTopApis();
  }
}
