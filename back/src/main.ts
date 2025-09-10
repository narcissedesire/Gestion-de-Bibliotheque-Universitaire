import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: 'http://localhost:5173',
      methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Accept,Authorization',
      credentials: true,
    });

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5432;
    await app.listen(port);
  } catch (error) {
    console.error(error);
  }
}
bootstrap();
