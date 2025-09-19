import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: "dpg-d36k12umcj7s73dllo90-a.frankfurt-postgres.render.com",
      port: 5432,
      username: "admin",
      password: "suprastindb",
      database: "sFaR8aeAtzLa5tP3Ag2ItuWxfEodsFde",
      autoLoadEntities: true,

      
      
      
      
      

      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    UsersModule,
    BlogsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}



