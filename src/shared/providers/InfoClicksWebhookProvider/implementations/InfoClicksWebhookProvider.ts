import { Injectable } from '@nestjs/common';
import IInfoClicksWebhookProvider from '../models/IInfoClicksWebhookProvider';

@Injectable()
export default class InfoClicksWebhookProvider
  implements IInfoClicksWebhookProvider
{
  public async create(link): Promise<boolean> {
    console.log('Clicks Info Webhooks');
    return true;
  }
}
