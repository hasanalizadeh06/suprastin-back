import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
   TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false, // Render için genelde böyle
  },
  autoLoadEntities: true,
  synchronize: true // prod’da false yapmayı unutma
}),

    AuthModule,
    UsersModule,
    BlogsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}



