import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  console.log('TSTSTSTSTST');
  console.log('PORT:', configService.get<string>('port'));
  console.log('MONGO_URI:', configService.get<string>('mongoUri'));
  console.log('JWT_SECRET:', configService.get<string>('jwtSecret'));

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:4500'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
