import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { LinksModule } from './modules/links/links.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonParser,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { LinkRepository } from './modules/links/repositories/implementations/link.repository';
import { LinkSchema } from './modules/links/schemas/link.schema';
import { UserSchema } from './modules/users/schemas/user.schema';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LinkInfosSchema } from './modules/links/schemas/link-infos.schema';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        pt: 'pt-BR',
      },
      parser: I18nJsonParser,
      parserOptions: {
        path: join(__dirname, '/i18n/'),
        watch: false,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),
    MongooseModule.forRoot(process.env.DATABASE_MONGODB_CONNECTION_STRING),
    MongooseModule.forFeature([
      { name: 'Link', schema: LinkSchema },
      { name: 'User', schema: UserSchema },
      { name: 'LinkInfos', schema: LinkInfosSchema },
    ]),
    UsersModule,
    LinksModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LinkRepository,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
