import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendRecoverPassword(email: string, url: string, lang: string) {
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject:
        lang === 'pt' ? 'Redefinição de senha Cli.la' : 'Cli.la password reset',
      template: lang === 'pt' ? 'recover-password-pt' : 'recover-password-en', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: email,
        url,
      },
    });
  }

  async sendValidationEmail(
    email: string,
    code: string,
    id: string,
    lang: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject:
        lang === 'pt' ? 'Ativação de e-mail Cli.la' : 'Cli.la email activation',
      template: lang === 'pt' ? 'validation-email-pt' : 'validation-email-en', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: email,
        code,
        id,
      },
    });
  }
}
