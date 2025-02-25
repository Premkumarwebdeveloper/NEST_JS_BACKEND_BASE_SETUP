import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ok } from 'assert';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
    
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async onModuleInit() {
    this.connectDatabase();
    this.getStatus();
  }

  private async connectDatabase() {
    try {
      if (!this.connection.db) {
        this.logger.log('MongoDB connection is not established');
      } else {
        const result = await this.connection.db.admin().ping(); // Check connection status
        if (result?.ok === 1) {
          this.logger.log('MongoDB connected successfully');
        } else {
          this.logger.warn('MongoDB ping response is not OK');
        }
      }
    } catch (err) {
      this.logger.error('Error connecting to MongoDB', err?.message);
    }
  }

  // Example method to interact with the database
  async getStatus(): Promise<any> {
    try {
      const result = await this.connection.db?.command({ ping: 1 });
      if (result?.ok === 1) {
        this.logger.log('MongoDB is up and running');
      } else {
        this.logger.log('MongoDB connection failed');
      }
    } catch (err) {
      this.logger.log(`MongoDB ping failed: ${err?.message}`);
    }
  }
}
