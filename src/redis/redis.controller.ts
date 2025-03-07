import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  // Store Data in Redis
  @Post('/set')
  async setKey(@Body() body: { key: string; value: any }) {
    await this.redisService.set(body.key, body.value);
    return { message: `Key "${body.key}" stored successfully` };
  }

  // Retrieve Data from Redis
  @Get('/get/:key')
  async getKey(@Param('key') key: string) {
    const value = await this.redisService.get(key);
    return value ? { key, value } : { error: 'Key not found in Redis' };
  }

  // Delete a Key from Redis
  @Delete('/delete/:key')
  async deleteKey(@Param('key') key: string) {
    await this.redisService.delete(key);
    return { message: `Key "${key}" deleted successfully` };
  }

  // Flush All Data from Redis
  @Delete('/flush')
  async flushRedis() {
    await this.redisService.flushAll();
    return { message: 'All Redis data cleared' };
  }
}
