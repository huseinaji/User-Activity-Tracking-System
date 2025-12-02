import { Module } from '@nestjs/common';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: 'KEYV_CLIENT',
      useFactory: () => {
        return new Keyv({
          store: new KeyvRedis('redis://localhost:6379?connectionName=keyv-store'),
          ttl: 3600*1000, // default TTL 1 hour
        });
      },
    },
    CacheService,
  ],
  exports: ['KEYV_CLIENT', CacheService],
})
export class CacheModule {}