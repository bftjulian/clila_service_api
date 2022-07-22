/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

    await this.client.set(id, parseData);

    return data;
  }

  public async read(id: any): Promise<any> {
    const rawData = await this.client.get(id);

    const parsedData = JSON.parse(rawData);

    return parsedData;
  }

  public async delete(id: any): Promise<any> {
    return await this.client.del(id);
  }

  public async readManyByPattern(idPattern: string) {
    const keys = await this.client.keys(idPattern);

    const values = await Promise.all(keys.map((key) => this.read(key)));

    return values;
  }

  public async deleteManyByPattern(idPattern: string) {
    const keys = await this.client.keys(idPattern);

    const keysDeleted = await Promise.all(
      keys.map((key) => {
        return this.client.del(key);
      }),
    );

    return keysDeleted;
  }

  public async createHash(id: string, data: object) {
    await this.client.hset(id, data);
  }

  public async readHash(id: string, field: string) {
    return this.client.hget(id, field);
  }

  public async readHashAll(id: string) {
    return await this.client.hgetall(id);
  }

  public async readIds() {
    const IDPATTERN = 'dashboard:*';

    return this.client.keys(IDPATTERN);
  }

  public async incrementValue(id: string, value?: number) {
    if (!!value && value > 1) {
      await this.client.incrby(id, value);

      return this.read(id);
    } else {
      await this.client.incr(id);

      return this.read(id);
    }
  }
}
