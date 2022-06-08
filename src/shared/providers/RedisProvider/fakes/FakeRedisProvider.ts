import IRedisProvider from '../models/IRedisProvider';

interface ICacheData {
  [key: string]: any;
}

export default class FakeRedisProvider implements IRedisProvider {
  ltrim(key: string, start: number, stop: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  zadd(key: string, score: number, value: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  zremrangebyscore(key: string, min: number, max: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  zscan(key: string, pattern?: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  zhas(key: string, value: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  private cache: ICacheData = {};

  public async popMany(key: string, count: number): Promise<string[]> {
    return this.cache[key]?.splice(0, count);
  }

  public async lrange(
    key: string,
    start: number,
    stop: number,
  ): Promise<string[]> {
    return this.cache[key] ? this.cache[key].slice(start, stop) : [];
  }

  public async delete(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async popAll(key: string): Promise<string[]> {
    const data = this.cache[key];
    delete this.cache[key];
    return data;
  }

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async llen(key: string): Promise<number> {
    return this.cache[key] ? this.cache[key].length : 0;
  }

  public async lpush(key: string, value: string | string[]): Promise<void> {
    if (!this.cache[key]) {
      this.cache[key] = [];
    }

    if (typeof value === 'string') {
      this.cache[key].push(value);
      return;
    }
    if (Array.isArray(value)) {
      this.cache[key].push(...value);
      return;
    }
  }

  public async lpop(key: string): Promise<string> {
    if (!this.cache[key]) {
      return null;
    }

    return this.cache[key].pop();
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter((key) =>
      key.startsWith(`${prefix}:`),
    );
    keys.forEach((key) => {
      delete this.cache[key];
    });
  }
}
