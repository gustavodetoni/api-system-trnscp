import { PutObjectCommand } from '@aws-sdk/client-s3'
import {
  StorageRepository,
  UploadFileParams,
  UploadFileResponse,
} from '../../core/repositories/storage-repository'
import { s3Client } from '../config/aws'

export class S3StorageRepository implements StorageRepository {
  async upload({
    fileName,
    body,
    contentType,
  }: UploadFileParams): Promise<UploadFileResponse> {
    if (!process.env.AWS_BUCKET_NAME) {
      throw new Error('AWS_BUCKET_NAME is not set')
    }

    const bucketName = process.env.AWS_BUCKET_NAME

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: body,
        ContentType: contentType,
      })
    )

    const url = `s3://${bucketName}/${fileName}`

    return { url }
  }
}
