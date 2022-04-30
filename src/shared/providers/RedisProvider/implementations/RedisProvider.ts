import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';
import IRedisProvider from '../models/IRedisProvider';

@Injectable()
export default class RedisProvider implements IRedisProvider {
  private client: RedisClient;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');
    const password = this.configService.get<string>('REDIS_PASSWORD');

    this.client = new Redis({
      host,
      port,
      password: password && password.length > 0 ? password : undefined,
    });
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async popAll(key: string): Promise<string[]> {
    const data = await this.client.lrange(key, 0, -1);
    await this.client.del(key);
    return data;
  }

  public async lrange(
    key: string,
    start: number,
    stop: number,
  ): Promise<string[]> {
    return await this.client.lrange(key, start, stop);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async llen(key: string): Promise<number> {
    return await this.client.llen(key);
  }

  public async lpush(key: string, value: string | string[]): Promise<void> {
    if (typeof value === 'string') {
      await this.client.lpush(key, value);
      return;
    }
    if (Array.isArray(value)) {
      await this.client.lpush(key, ...value);
      return;
    }
  }

  public async lpop(key: string): Promise<string> {
    return await this.client.lpop(key);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach((key) => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
