import { ICheckManyResult } from './check-many-result';
import { ICheckResult } from './check-result.interface';

export interface IMaliciousContentCheckProvider {
  check(url: string): Promise<ICheckResult>;
  checkMany(urls: string[]): Promise<ICheckManyResult>;
}
