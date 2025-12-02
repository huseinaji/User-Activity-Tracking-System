import { Module } from '@nestjs/common';
import { ApisService } from './apis.service';
import { ApisController } from './apis.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from 'src/common/schema/log.schema';
import { ClientModule } from 'src/client/client.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    CacheModule,
    SequelizeModule.forFeature([Log]),
    ClientModule
  ],
  controllers: [ApisController],
  providers: [ApisService],
})
export class ApisModule {}
