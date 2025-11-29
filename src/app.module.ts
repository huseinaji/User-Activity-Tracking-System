import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApisModule } from './apis/apis.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Api } from './apis/entities/api.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ApisModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: '192.168.1.41',
      port: process.env.DB_PORT as unknown as number || 5432,
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'user_activity',
      models: [Api, User],
      
      autoLoadModels: true,
      synchronize: true,
    }),  
    ConfigModule.forRoot({ isGlobal: true }), 
    UserModule, 
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
