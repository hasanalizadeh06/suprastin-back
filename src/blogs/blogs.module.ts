import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Blog } from './blog.entity';
import { S3Service } from '../s3/s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), ConfigModule],
  providers: [BlogsService, S3Service, Logger],
  controllers: [BlogsController],
  exports: [BlogsService],
})
export class BlogsModule {}
