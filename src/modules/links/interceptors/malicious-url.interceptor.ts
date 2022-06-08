import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Observable } from 'rxjs';
import { Result } from 'src/shared/models/result';
import { MaliciousContentCheckProvider } from 'src/shared/providers/MaliciousContentCheckProvider/implementations/malicious-content-check.provider';
import { ICheckResult } from 'src/shared/providers/MaliciousContentCheckProvider/models/check-result.interface';
import RedisProvider from 'src/shared/providers/RedisProvider/implementations/RedisProvider';
import { formatLink } from 'src/utils/formatLink';
import {
  MALICIOUS_URLS,
  URLS_TO_CHECK_MALICIOUS_CONTENT,
} from '../links.constants';

@Injectable()
export class MaliciousUrlInterceptor implements NestInterceptor {
  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly maliciousContentCheck: MaliciousContentCheckProvider,
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const {
      body: { original_link },
    } = request;

    if (!original_link) {
      next.handle();
      return;
    }

    const parsedLink = formatLink(original_link);

    const maliciousOnCache = await this.redisProvider.zhas(
      MALICIOUS_URLS,
      parsedLink,
    );
    console.log(maliciousOnCache);
    if (maliciousOnCache) {
      throw new BadRequestException(
        new Result('Malicious content detected', false, {}, null),
      );
    }

    let maliciousContentResult: ICheckResult;
    try {
      maliciousContentResult = await this.maliciousContentCheck.check(
        parsedLink,
      );
    } catch {
      await this.redisProvider.lpush(
        URLS_TO_CHECK_MALICIOUS_CONTENT,
        parsedLink,
      );
      return next.handle();
    }

    if (maliciousContentResult.isMalicious) {
      await this.redisProvider.zadd(
        MALICIOUS_URLS,
        new Date().getTime(),
        parsedLink,
      );
      throw new BadRequestException(
        new Result('Malicious content detected', false, {}, null),
      );
    }

    return next.handle();
  }
}
