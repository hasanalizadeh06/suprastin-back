import { Injectable, Logger } from "@nestjs/common";
import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from "uuid";
import type { File as MulterFile } from "multer";
export type { MulterFile };

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly spacesEndpoint: string;
  private readonly spacesEndpointKey: string;
  private readonly spacesAccessKeyId: string;
  private readonly spacesSecretAccessKey: string;
  private readonly bucketName: string;

  constructor(
    private config: ConfigService,
    private readonly logger: Logger = new Logger(S3Service.name),
  ) {
    this.spacesEndpoint = this.config.get("SPACES_ENDPOINT") || "";
    this.spacesEndpointKey = this.config.get("SPACES_ENDPOINT_KEY") || "";
    this.spacesAccessKeyId = this.config.get("SPACES_ACCESS_KEY_ID") || "";
    this.spacesSecretAccessKey =
      this.config.get("SPACES_SECRET_ACCESS_KEY") || "";
  this.bucketName = this.config.get("BUCKET_NAME") || "";

    this.logger.log('BUCKET_NAME:', this.bucketName);

    this.s3Client = new S3Client({
      endpoint: this.spacesEndpoint,
      region: "fra1",
      credentials: {
        accessKeyId: this.spacesAccessKeyId,
        secretAccessKey: this.spacesSecretAccessKey,
      },
    });
  }
  async uploadFile(file: MulterFile): Promise<string> {
    try {
      if (!file || !file.originalname || !file.buffer) {
        throw new Error("Invalid or missing file input");
      }

      const fileExtension = file.originalname.includes(".")
        ? file.originalname.split(".").pop()
        : null;

      if (!fileExtension) {
        throw new Error("File does not have a valid extension");
      }

      const fileName = `${uuidv4()}.${fileExtension}`;
      const key = `tasks/images/sorbifer/${fileName}`;

      this.logger.log(`Uploading file with key: ${key}`);
      return await this.uploadObject(key, file.buffer);
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove the leading '/'

      if (!key) {
        throw new Error("Invalid file URL, unable to extract key");
      }

      await this.deleteObject(key);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async uploadObject(key: string, data: Buffer): Promise<string> {
    if (!key) {
      this.logger.error("Upload key is empty");
      throw new Error("Upload key is required");
    }

    if (!data || !Buffer.isBuffer(data)) {
      this.logger.error("Invalid file data for upload");
      throw new Error("Upload data must be a valid buffer");
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: data,
      ACL: ObjectCannedACL.public_read,
    });

    await this.s3Client.send(command);
    this.logger.log("uploadObject --> Success");

    return `https://${this.bucketName}.${this.spacesEndpointKey}/${key}`;
  }

  async deleteObject(key: string): Promise<void> {
    if (!key) {
      this.logger.error("Delete key is empty");
      throw new Error("Delete key is required");
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
    this.logger.log("deleteObject --> Success");
  }
}
