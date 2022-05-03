import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { createBullBoard } from '@bull-board/api/';
import { Queue } from 'bull';
import { LINK_CLICKED_PROCCESSOR_NAME } from './app.constants';
import {
  HASHES_PROCESSOR,
  IMPORT_HASHES_FROM_LINKS_PROCESSOR,
  LINKS_BATCH_PROCESSOR,
} from './modules/links/links.constants';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());

  app.enableCors({
    origin: '*',
    exposedHeaders: ['x-total-count'],
  });
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Clila API')
    .setDescription('')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/bull-board');

  const queues = [
    new BullAdapter(
      app.get<Queue>(`BullQueue_${LINK_CLICKED_PROCCESSOR_NAME}`),
    ),
    new BullAdapter(app.get<Queue>(`BullQueue_${HASHES_PROCESSOR}`)),
    new BullAdapter(
      app.get<Queue>(`BullQueue_${IMPORT_HASHES_FROM_LINKS_PROCESSOR}`),
    ),
    new BullAdapter(app.get<Queue>(`BullQueue_${LINKS_BATCH_PROCESSOR}`)),
  ];

  createBullBoard({
    queues: queues,
    serverAdapter,
  });

  app.use(
    '/bull-board',
    expressBasicAuth({
      users: {
        user: 'password',
      },
      challenge: true,
    }),
    serverAdapter.getRouter(),
  );

  // app.setGlobalPrefix('api', { exclude: ['docs', '/:hash'] });
  await app.listen(3000);
}
bootstrap();
