import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database/database.service';
import { RedisModule } from './redis/redis.module';
import { RedisController } from './redis/redis.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    MongooseModule.forRoot(process.env.MONGODB_URI || '', {
      dbName: process.env.MONGO_DBNAME,
    }),
    AuthModule,
    RedisModule
  ],
  controllers: [AppController,RedisController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
