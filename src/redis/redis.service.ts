import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redisClient: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    this.redisClient = new Redis({
      host: '127.0.0.1', // Redis server host
      port: 6379, // Default Redis port
    });

    this.redisClient.on('connect', () => {
      this.logger.log('Redis Connected Successfully!');
    });

    this.redisClient.on('error', (err) => {
      this.logger.warn('Redis Connection Error:', err);
    });
  }

  //  @ Redis Set API
  // 🔹 Key: "user:123"
  // 🔹 Value (after JSON.stringify): '{"name":"John","age":30}'
  // 🔹 Expiration: 3600 seconds (1 hour)

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }

  //  @ Redis Get API
  // 🔹 Key: "user:123"

  async get(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  //  @ Redis Delete API
  // 🔹 Key: "user:123"

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  //  @ Redis Flush All API

  async flushAll(): Promise<void> {
    await this.redisClient.flushall();
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }

  onModuleInit() {
    this.logger.log('RedisService Initialized');
  }
}
