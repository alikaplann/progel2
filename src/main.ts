import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import { CacheInterceptor,CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
async function bootstrap() {
  dotenv.config();

  // Create Nest application
  const app = await NestFactory.create(AppModule);
  const cacheManager = app.get(CACHE_MANAGER);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true,transform: true,
    forbidNonWhitelisted: true, }));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Nest-Prisma-Auth API')
    .setDescription('User & Auth endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
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
      'oauth2-password',
    )
    .build();

  // Create Swagger 
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalInterceptors(new CacheInterceptor(cacheManager, reflector));
  app.use('/users-json', (req: Request, res: Response) => {
    res.json(document);
  });

  SwaggerModule.setup('users', app, document, {
    swaggerOptions: {
      url: '/users-json',
    },
  });

  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();



