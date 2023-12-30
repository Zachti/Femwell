import { S3 } from 'aws-sdk'
import { Inject } from '@nestjs/common'

export const InjectS3Token = () => Inject(s3Token)

export const s3Token = Symbol('S3_TOKEN')

export const s3Provider = {
  provide: s3Token,
  useFactory: () => {
    return new S3({
      region: process.env['AWS_S3_REGION'],
      credentials: {
        secretAccessKey: process.env['AWS_SECRET_KEY'],
        accessKeyId: process.env['AWS_ACCESS_KEY']
      },
    })
  }
}
