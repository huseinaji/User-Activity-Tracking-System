import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApisModule } from './apis/apis.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { Client } from './common/schema/client.schema';
import { Dialect } from 'sequelize';
import { UserModule } from './user/user.module';
import { User } from './common/schema/user.schema';
import { CacheService } from './cache/cache.service';
import { CacheModule } from './cache/cache.module';
import { IpWhitelistMiddleware } from './common/middleware/ip-whitelist.middleware';
import { Log } from './common/schema/log.schema';

@Module({
  imports: [
    ApisModule,
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_URI,
      port: process.env.DB_PORT as unknown as number || 5432,
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'user_activity',
      models: [Client, User, Log],
      
      autoLoadModels: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }), 
    AuthModule, ClientModule, UserModule, CacheModule
  ],
  providers: [CacheService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpWhitelistMiddleware).forRoutes('*')
  }
}
