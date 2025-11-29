import { Module } from '@nestjs/common';
import { ApisService } from './apis.service';
import { ApisController } from './apis.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Api } from './entities/api.entity';

@Module({
  imports: [SequelizeModule.forFeature([Api])],
  controllers: [ApisController],
  providers: [ApisService],
})
export class ApisModule {}
