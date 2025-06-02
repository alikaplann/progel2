// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import { Reflector, HttpAdapterHost } from '@nestjs/core';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';

async function bootstrap() {
  dotenv.config();

  // 1. Nest uygulamasını yaratın
  const app = await NestFactory.create(AppModule);

  // 2. Bir ValidationPipe ekleyin
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // 3. Swagger yapılandırması (isteğe bağlı)
  const config = new DocumentBuilder()
    .setTitle('Nest-Prisma-Auth API')
    .setDescription('User & Auth endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token'
    )
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: 'http://localhost:8080/auth/signin',
            scopes: {},
          },
        },
      },
      'oauth2-password'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 4. “/users-json” endpoint’ini ekleyin (isteğe bağlı)
  app.use('/users-json', (req: Request, res: Response) => {
    res.json(document);
  });

  SwaggerModule.setup('users', app, document, {
    swaggerOptions: {
      url: '/users-json',
    },
  });

  await app.listen(8080, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
