import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'https://localhost:8000',
    credentials: true, // this gives the possibility to pass cookie back and forth between requests
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
