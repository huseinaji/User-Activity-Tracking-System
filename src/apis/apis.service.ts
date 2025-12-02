import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { Log } from 'src/common/schema/log.schema';
import { CreateLogDto } from './dto/create-record.dto';
import { Sequelize } from 'sequelize-typescript';
import Redis from 'ioredis';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ApisService implements OnModuleInit {
  private readonly logger = new Logger(ApisService.name);
  private readonly publisher = new Redis(process.env.REDIS_URL!, {
    lazyConnect: true,
    connectionName: "publisher",
  });
  private readonly subscriber = new Redis(process.env.REDIS_URL!, {
    lazyConnect: true,
    connectionName: "subscriber",
  });
  constructor(
    @InjectModel(Log) private logModel: typeof Log,
    private sequelize: Sequelize,
    private cacheService: CacheService
  ) {}

  async getDaylyUsage() {
    const version = await this.cacheService.getVersion()
    const key = `${version}:usage:daily`
    console.log(key)

    const cached = await this.cacheService.get(key);
    if (cached) return cached;

    try {
      const [result] = await this.sequelize.query(
        `
        SELECT 
          api_key,
          DATE(created_at) as Day,
          COUNT(*) as total_request
        FROM logs
        where created_at >= NOW() - INTERVAL '7 days'
        GROUP BY api_key, day
        ORDER BY day DESC, api_key
        `
      )
      await this.cacheService.set(key, result);
      return result
    } catch (error) {
      throw error;
    }
  }

  async getTopApis() {
    const version = await this.cacheService.getVersion()
    const key = `${version}:usage:topApi`

    const cached = await this.cacheService.get(key);
    if (cached) return cached;

    const [result] = await this.sequelize.query(
      `
      SELECT 
        api_key,
        COUNT(*) as total_request
      FROM logs
      WHERE DATE(created_at) >= NOW() - INTERVAL '24 hours'
      GROUP BY api_key
      ORDER BY total_request DESC
      LIMIT 3
      `
    )
    await this.cacheService.set(key, result);
    return result
  }

  recordApi(req: Request, data: CreateLogDto) {
    const logsData = {
      apiKey: req.headers['api-key'],
      ip: data.ip,
      endpoint: data.endpoint
    }
    const result = this.logModel.create(logsData)
    // Avoid stale cache reads/ cache versioning
    this.cacheService.bumpVersion()
    //Redis Pub/Sub:
    this.publisher.publish('log_updated', 'true')
    return result
  }

  async onModuleInit() {
    console.log("Pre-warming usage cache...")
    //cache pre-warming
    await this.getDaylyUsage()
    await this.getTopApis()

    //Redis Pub/Sub
    this.subscriber.subscribe('log_updated')
    this.subscriber.on('message', (channel, message) => {
      if (channel == "log_updated") {
        this.logger.log('Log update was received', message);
        // Implement a cache prefetch mechanism for the /api/usage/top
        this.getTopApis()
      }
    })
  }
}
