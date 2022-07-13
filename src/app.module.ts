import {
  I18nModule,
  QueryResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonParser,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appsProcessors } from './proccessors';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from './modules/users/users.module';
import { LinksModule } from './modules/links/links.module';
import { LINK_CLICKED_PROCCESSOR_NAME } from './app.constants';
import { MetricsModule } from './modules/metrics/metrics.module';
import { LinkSchema } from './modules/links/schemas/link.schema';
import { UserSchema } from './modules/users/schemas/user.schema';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { GroupSchema } from './modules/links/schemas/groups.schema';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LinkInfosSchema } from './modules/links/schemas/link-infos.schema';
import { RefreshTokenSchema } from './modules/users/schemas/refresh-tokens.schema';
import { LinkRepository } from './modules/links/repositories/implementations/link.repository';
import { GroupRepository } from './modules/links/repositories/implementations/group.repository';
import { FeedUserDataApiTokenMiddleware } from './modules/auth/middlewares/feed-user-data-api-token.middleware';

@Module({
  imports: [
    BullModule.registerQueue({
      name: LINK_CLICKED_PROCCESSOR_NAME,
    }),
    ScheduleModule.forRoot(),
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
      { name: 'Group', schema: GroupSchema },
      { name: 'LinkInfos', schema: LinkInfosSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
      { name: 'Group', schema: GroupSchema },
    ]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password:
          process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD.length > 0
            ? process.env.REDIS_PASSWORD
            : undefined,
      },
    }),
    UsersModule,
    LinksModule,
    AuthModule,
    MailModule,
    DashboardModule,
    ScheduleModule.forRoot(),
    SharedModule,
    EventEmitterModule.forRoot(),
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LinkRepository,
    GroupRepository,

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    ...appsProcessors,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FeedUserDataApiTokenMiddleware).forRoutes('*');
  }
}
