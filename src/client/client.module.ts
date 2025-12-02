import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from 'src/common/schema/client.schema';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
      SequelizeModule.forFeature([Client]),
    ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [SequelizeModule]
})
export class ClientModule {}
