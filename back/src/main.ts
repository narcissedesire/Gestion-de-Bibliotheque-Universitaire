import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer CORS avec des options spécifiques
  app.enableCors({
    origin: 'http://localhost:5173', // Autoriser uniquement cette origine
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS', // Méthodes autorisées
    allowedHeaders: 'Content-Type,Accept,Authorization', // Headers autorisés
    credentials: true, // Autoriser les cookies ou les credentials si nécessaire
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
