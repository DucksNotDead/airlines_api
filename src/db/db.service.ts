import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  // Подключение к базе данных
  async onModuleInit() {
    this.client = new Client({
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) ?? 5432,
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'airlines',
    });

    try {
      await this.client.connect();
      console.log('Connected to PostgreSQL');
    } catch (error) {
      console.error('Failed to connect to PostgreSQL', error);
    }
  }

  async query<T>(text: string, params?: any[]): Promise<T[]> {
    try {
      const res = await this.client.query(text, params);
      return res.rows;
    } catch (error) {
      console.error('Database query error', error);
    }
  }

  async queryItem<T>(text: string, params?: any[]): Promise<T> {
    try {
      const res = await this.client.query(text, params);
      return res.rows[0];
    } catch (error) {
      console.error('Database query item error', error);
    }
  }

  async onModuleDestroy() {
    await this.client.end();
    console.log('Disconnected from PostgreSQL');
  }
}
