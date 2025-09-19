import { Global, Logger, Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { S3Service } from "./s3.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [S3Service, Logger],
  exports: [S3Service],
})
export class S3Module {}
