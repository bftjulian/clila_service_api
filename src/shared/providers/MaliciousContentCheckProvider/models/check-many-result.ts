import { ICheckResult } from './check-result.interface';

export interface ICheckManyResult {
  hasSomeMalicious: boolean;
  maliciousUrls: string[];
  maliciousUrlsResults: ICheckResult[];
}
