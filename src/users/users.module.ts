import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from '../s3/s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [UsersService, S3Service, Logger],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}