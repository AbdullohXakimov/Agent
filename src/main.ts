import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173', // Adjust if necessary
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Library')
    .setDescription('The project is for selling books')
    .setVersion('1.0')
    .addTag('library', 'books')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000, () => console.log('started'));
}
bootstrap();
