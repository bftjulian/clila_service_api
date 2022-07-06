import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';
import { ICacheDataRepository } from '../interfaces/cache-data-repository.interface';

@Injectable()
export class CacheDataRepository implements ICacheDataRepository {
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

  public async create(id: string, data: object): Promise<any> {
    const parseData = JSON.stringify(data);

    return await this.client.set(id, parseData);
  }

  public async read(id: any): Promise<any> {
    const rawData = await this.client.get(id);

    return JSON.parse(rawData);
  }

  public async delete(id: any): Promise<any> {
    return await this.client.del(id);
  }

  public async readMany(idPattern: string): Promise<any> {
    const keys = await this.client.keys(idPattern);

    const values = keys.map((key) => this.read(key));

    return values;
  }
}
