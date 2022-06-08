import { Injectable } from '@nestjs/common';
import { ICheckManyResult } from '../models/check-many-result';
import { ICheckResult } from '../models/check-result.interface';
import { IMaliciousContentCheckProvider } from '../models/malicious-content-check-provider.interface';
import { GoogleSafeBrowsingProvider } from './google-safe-browsing.provider';

type PromiseSettledResultAlt<T> = PromiseSettledResult<T> & {
  value: T;
};

@Injectable()
export class MaliciousContentCheckProvider
  implements IMaliciousContentCheckProvider
{
  constructor(private readonly googleProvider: GoogleSafeBrowsingProvider) {}

  public async check(url: string): Promise<ICheckResult> {
    const promises = await Promise.allSettled([this.googleProvider.check(url)]);

    return promises
      .filter((promise) => promise.status === 'fulfilled')
      .map((response: PromiseSettledResultAlt<ICheckResult>) => response.value)
      .reduce(
        (acc, curr) => {
          if (curr.isMalicious) {
            acc.isMalicious = true;
            acc.isMaliciousReason.push(...curr.isMaliciousReason);
            acc.detectedProviders.push(...curr.detectedProviders);
          }

          return acc;
        },
        {
          isMalicious: false,
          isMaliciousReason: [],
          detectedProviders: [],
        } as ICheckResult,
      );
  }

  public async checkMany(urls: string[]): Promise<ICheckManyResult> {
    const promises = await Promise.allSettled([
      this.googleProvider.checkMany(urls),
    ]);

    return promises
      .filter((promise) => promise.status === 'fulfilled')
      .map(
        (response: PromiseSettledResultAlt<ICheckManyResult>) => response.value,
      )
      .reduce(
        (acc, curr) => {
          if (curr.hasSomeMalicious) acc.hasSomeMalicious = true;

          acc.maliciousUrls.push(
            ...curr.maliciousUrls.filter(
              (url) => !acc.maliciousUrls.includes(url),
            ),
          );
          acc.maliciousUrlsResults.push(...curr.maliciousUrlsResults);

          return acc;
        },
        {
          hasSomeMalicious: false,
          maliciousUrls: [],
          maliciousUrlsResults: [],
        } as ICheckManyResult,
      );
  }
}
