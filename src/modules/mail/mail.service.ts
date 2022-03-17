import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendRecoverPassword(email: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Redefinição de senha Cli.la',
      template: 'recover-password', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: email,
        url,
      },
    });
  }

  async sendValidationEmail(email: string, code: string, id: string) {
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Ativação de e-mail Cli.la',
      template: 'validation-email', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: email,
        code,
        id,
      },
    });
  }
}
