import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { Observable } from 'rxjs';

@Injectable()
export class RatelimitGuard implements CanActivate {
  private readonly redis: Redis;
  private readonly logger = new Logger(RatelimitGuard.name);
  private fallbackStore = new Map<string, { count: number; reset: number }>();

  LIMIT = 1000;
  TTL = 3600;
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!, {
      lazyConnect: true,
      connectionName: 'ratelimitter'
    })
  }

  async canActivate( context: ExecutionContext): Promise<boolean>{
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers['api-key'];

    if (!apiKey) {
      throw new HttpException('Missing API Key', HttpStatus.BAD_REQUEST);
    }

    const redisKey = `ratelimit:${apiKey}`

    try {
      const current = await this.redis.incr(redisKey);
      console.log("current", current, this.LIMIT, current > this.LIMIT)

      if (current === 1){
        await this.redis.expire(redisKey, this.TTL)
      }
      if (current > this.LIMIT) {
        throw new HttpException(
          `Rate limit exceed (${this.LIMIT}/hour)`,
          HttpStatus.TOO_MANY_REQUESTS
        )
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error("Redis DOWN. Using local fallback limiter");

      // === MEMORY FALLBACK ===
      const now = Date.now();
      const item = this.fallbackStore.get(apiKey);

      if (!item || now > item.reset) {
        this.fallbackStore.set(apiKey, {
          count: 1,
          reset: now + this.TTL * 1000,
        });
        return true;
      }

      item.count++;

      if (item.count > this.LIMIT) {
        throw new HttpException(
          `Rate limit exceeded (${this.LIMIT}/hour)`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      return true
    }
  }
}
