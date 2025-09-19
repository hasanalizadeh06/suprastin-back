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
      host: 'dpg-d36jdd7fte5s73bhivu0-a',
      port: 5432,
      username: 'suprastin',
      password: 'hv8ijlx9OEjyKeOrvAwD2Wq0qVjJ8Btx',
      database: 'suprastin',
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



