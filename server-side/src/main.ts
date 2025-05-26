import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  console.log('ENV TEST:');
  console.log('PORT:', configService.get<string>('port'));
  console.log('MONGO_URI:', configService.get<string>('mongoUri'));
  console.log('JWT_SECRET:', configService.get<string>('jwtSecret'));

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
