import { Injectable } from '@nestjs/common';
import { Link } from 'src/modules/links/models/link.model';
import axios, { AxiosInstance } from 'axios';
import IInfoClicksWebhookProvider from '../models/IInfoClicksWebhookProvider';

@Injectable()
export class DisparoproInfoClicksWebhookProvider
  implements IInfoClicksWebhookProvider
{
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.DISPAROPRO_WEBHOOK_API,
    });
  }

  public async sendClickInfo(link: Link): Promise<boolean> {
    const { short_link, numbers_clicks } = link;

    const data = {
      short_link,
      total_clicks: numbers_clicks,
    };

    try {
      await this.api.post('/clila-link', data);
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
