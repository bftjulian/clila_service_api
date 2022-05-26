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
    const {
      short_link,
      numbers_clicks,
      group: { total_clicks, _id },
      create_at,
    } = link;

    const data = {
      short_link,
      total_clicks: numbers_clicks,
      group_total_clicks: total_clicks + 1,
      group_id: _id.toString(),
      create_at: `${create_at.getFullYear()}-${(create_at.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${create_at.getDate()}`,
      date_create_formated: `${create_at.getFullYear()}_${(
        create_at.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}_${create_at.getDate()}`,
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
