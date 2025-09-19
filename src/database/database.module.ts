import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // veya kullandığınız veritabanı türü
      host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'mydb',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // production'da false olmalı
    }),
  ],
})
export class DatabaseModule {}
