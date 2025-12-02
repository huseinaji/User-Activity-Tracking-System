import { Injectable, Inject, Logger } from '@nestjs/common';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import Redis from 'ioredis';
import { LRUCache } from 'lru-cache';

@Injectable()
export class CacheService {
  private readonly redis: Redis;
  private readonly logger = new Logger(CacheService.name);
  private readonly memoryCache: LRUCache<string, any>;

  constructor(@Inject('KEYV_CLIENT') private cache: Keyv) {
    this.redis = new Redis(process.env.REDIS_URL!, {
      lazyConnect: true,
      connectionName: 'cache',
    });
    //Caching Alternatives
    this.memoryCache = new LRUCache({
      max: 500,
      ttl: 1000 * 60,
    });
  }

  async getVersion(): Promise<number> {
    try {
      const v = await this.redis.get('usage-cache-version');
      if (!v) {
        await this.redis.set('usage-cache-version', 1);
        return 1;
      }
      return Number(v);
    } catch (err) {
      this.logger.error('Redis DOWN (version). Using local fallback.');

      const local = this.memoryCache.get('usage-cache-version') ?? 1;
      this.memoryCache.set('usage-cache-version', local);

      return local;
    }
  }

  async bumpVersion() {
    try {
      await this.redis.incr('usage-cache-version');
    } catch (err) {
      this.logger.error('Redis DOWN (bump). Increasing local version.');

      const v = this.memoryCache.get('usage-cache-version') ?? 1;
      this.memoryCache.set('usage-cache-version', v + 1);
    }
  }

  async get(key: string) {
    try {
      return await this.cache.get(key);
    } catch (err) {
      this.logger.error('Redis DOWN. Using fallback local cache');
      return this.memoryCache.get(key);
    }
  }

  async set(key: string, value: any, ttl = 3600) {
    try {
      return await this.cache.set(key, value, ttl * 1000);
    } catch (err) {
      this.logger.error('Redis DOWN. Using fallback local cache');
      return this.memoryCache.set(key, value);
    }
  }
}
