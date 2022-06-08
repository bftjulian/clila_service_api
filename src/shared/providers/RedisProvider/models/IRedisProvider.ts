export default interface IRedisProvider {
  save(key: string, value: any): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  llen(key: string): Promise<number>;
  ltrim(key: string, start: number, stop: number): Promise<void>;
  lpush(key: string, value: string | string[]): Promise<void>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  lpop(key: string): Promise<string | null>;
  zadd(key: string, score: number, value: string): Promise<void>;
  zremrangebyscore(key: string, min: number, max: number): Promise<void>;
  zscan(key: string, pattern?: string): Promise<string[]>;
  zhas(key: string, value: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  popAll(key: string): Promise<string[]>;
  popMany(key: string, count: number): Promise<string[]>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
