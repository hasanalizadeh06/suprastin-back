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
      host: 'dpg-d2rd4nadbo4c73d5uj90-a',
      port: 5432,
      username: 'sorbifer',
      password: 'ijADFKEjzIS6AXXqV58zp2nbY9w0EPMY',
      database: 'sorbifer',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    BlogsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}



