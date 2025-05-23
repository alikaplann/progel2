import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

async function bootstrap() {
  // Load environment variables
  dotenv.config();

  // Create Nest application
  const app = await NestFactory.create(AppModule);

  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

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

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Serve JSON spec
  app.use('/users-json', (req: Request, res: Response) => {
    res.json(document);
  });

  // Setup Swagger UI at '/users', pointing to the JSON spec
  SwaggerModule.setup('users', app, document, {
    swaggerOptions: {
      url: '/users-json',
    },
  });

  // Start server
  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();



