import {
  Bind,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk';
import { env } from 'process';

const BUCKET_NAME = 'zmfhdn77ubers3';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @Bind(UploadedFile())
  async uploadFile(file) {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    try {
      const objectName = `${Date.now() + file.originalname}`;
      const upload = await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();
      console.log(upload);
      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
