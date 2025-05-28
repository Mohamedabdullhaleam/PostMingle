import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_S3_REGION'),
      endpoint: this.configService.getOrThrow('AWS_S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.bucket = this.configService.getOrThrow('AWS_S3_BUCKET');
    this.endpoint = this.configService.getOrThrow('AWS_S3_PUBLIC_URL'); // We'll add this in .env
  }

  async upload(fileName: string, file: Buffer) {
    // Upload the file
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: file,
      }),
    );

    const fileUrl = `${this.endpoint}/${this.bucket}/${fileName}`;

    return {
      fileName,
      fileUrl,
    };
  }
}
