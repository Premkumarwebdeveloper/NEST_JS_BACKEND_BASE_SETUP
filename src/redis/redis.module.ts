import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
