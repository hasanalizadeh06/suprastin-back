import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log("---data---")
  Logger.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(process.env.PORT);
  console.log('ENV DB_HOST:', process.env.DB_HOST);
  await app.listen(process.env.PORT || 80);
}
bootstrap();
