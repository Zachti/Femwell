import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { Request } from 'express'
import { MimeTypes } from '../inetrfaces/interfaces';


@Injectable()
export class mimeTypePipe implements PipeTransform<Request, Promise<Request>> {
  constructor() {}

  async transform(request: Request): Promise<Request> {
    const file = request.file

    if (file && this.isNotValidMimeType(file.mimetype) ) {
      throw new BadRequestException('Invalid file mimeType. Only PDF or JPG are allowed.')
    }

    return request
  }

  isNotValidMimeType(mimeType: string){
    return mimeType !== MimeTypes.PDF && mimeType !== MimeTypes.JPG
  }
}
