import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookie from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookie());

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.APP_PORT ?? 8080);
}
void bootstrap();
