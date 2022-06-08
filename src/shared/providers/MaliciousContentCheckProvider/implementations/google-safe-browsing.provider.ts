import { ICheckResult } from '../models/check-result.interface';
import axios, { AxiosInstance } from 'axios';
import { IMaliciousContentCheckProvider } from '../models/malicious-content-check-provider.interface';
import { ProviderRequestError } from '../errors/provider-request.error';
import { ICheckManyResult } from '../models/check-many-result';
import { Injectable } from '@nestjs/common';

interface IGoogleMatch {
  threatType: string;
  platformType: string;
  threat: {
    url: string;
  };
  cacheDuration: string;
  threatEntryType: string;
}

interface IGoogleSafeBrowsingResponse {
  matches?: IGoogleMatch[];
}

@Injectable()
export class GoogleSafeBrowsingProvider
  implements IMaliciousContentCheckProvider
{
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_API_KEY}`,
    });
  }

  public async check(url: string): Promise<ICheckResult> {
    try {
      const { data } = await this.api.post('', {
        client: {
          clientId: 'clila-352618',
          clientVersion: '1.5.2',
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
          platformTypes: ['ALL_PLATFORMS'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      });

      return {
        isMalicious: !!data.matches && data.matches.length > 0,
        isMaliciousReason: data.matches ? [data.matches[0].threatType] : [],
        detectedProviders: [this.constructor.name],
        url,
      };
    } catch {
      throw new ProviderRequestError(
        'Error while requesting Google Safe Browsing API',
      );
    }
  }

  public async checkMany(urls: string[]): Promise<ICheckManyResult> {
    const parsedUrls = urls.map((url) => ({ url }));
    const maliciousUrls: ICheckResult[] = [];
    const requestsCount = Math.ceil(
      parsedUrls.length / +process.env.GOOGLE_SAFE_BROWSING_MAX_URLS_ON_REQUEST,
    );

    const request = async (
      urls: { url: string }[],
    ): Promise<IGoogleMatch[]> => {
      const { data } = await this.api.post<IGoogleSafeBrowsingResponse>('', {
        client: {
          clientId: 'clila-352618',
          clientVersion: '1.5.2',
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
          platformTypes: ['ALL_PLATFORMS'],
          threatEntryTypes: ['URL'],
          threatEntries: urls,
        },
      });

      return data.matches || [];
    };

    const promises = Array.from(Array(requestsCount).keys()).map(() => {
      const urlsToRequest = parsedUrls.splice(
        0,
        +process.env.GOOGLE_SAFE_BROWSING_MAX_URLS_ON_REQUEST - 1,
      );

      return request(urlsToRequest);
    });

    try {
      const results = await Promise.all(promises);

      return results
        .reduce((acc, curr) => acc.concat(curr), [])
        .reduce(
          (acc, curr) => {
            acc.hasSomeMalicious = true;
            acc.maliciousUrls.push(curr.threat.url);
            acc.maliciousUrlsResults.push({
              isMalicious: true,
              isMaliciousReason: [curr.threatType],
              detectedProviders: [this.constructor.name],
              url: curr.threat.url,
            });

            return acc;
          },
          {
            hasSomeMalicious: false,
            maliciousUrls: [],
            maliciousUrlsResults: [],
          } as ICheckManyResult,
        );
    } catch {
      throw new ProviderRequestError(
        'Error while requesting Google Safe Browsing API',
      );
    }
  }
}
