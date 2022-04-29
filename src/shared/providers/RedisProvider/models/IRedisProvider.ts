export default interface IRedisProvider {
  save(key: string, value: any): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  llen(key: string): Promise<number>;
  lpush(key: string, value: string | string[]): Promise<void>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  lpop(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  popAll(key: string): Promise<string[]>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
