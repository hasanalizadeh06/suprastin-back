import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'dpg-d37b5gur433s73ejiq00-a.oregon-postgres.render.com',
        port: 5432,
        username: 'suprastin_db',
        password: 'BjB6HCRS61yEd0duQquMosm99ELwmaaa',
        database: 'suprastin_db',
        autoLoadEntities: true,
        synchronize: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        logging: true,
      }),
    }),
    AuthModule,
    UsersModule,
    BlogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}