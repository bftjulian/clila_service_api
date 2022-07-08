import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  VERIFY_MALICIOUS_LINKS,
  VERIFY_MALICIOUS_LINKS_PROCESSOR,
} from '../links.constants';
import { IVerifyMaliciousLinksJob } from './jobs/verify-malicious-links.job';

@Processor(VERIFY_MALICIOUS_LINKS_PROCESSOR)
export class VerifyLinksMaliciousProcessor {
  // constructor(private readonly link: LinkRepository) {}

  @Process({
    concurrency: 1,
    name: VERIFY_MALICIOUS_LINKS,
  })
  public async verifyMaliciousLinks(job: Job<IVerifyMaliciousLinksJob>) {
    const { links } = job.data;
    console.log(links);
  }

  @OnQueueFailed()
  public onFailed(job: Job<IVerifyMaliciousLinksJob>, err: Error) {
    console.log(err);
  }
}
