import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { MimeTypes } from '../inetrfaces/interfaces';

@Injectable()
export class mimeTypePipe implements PipeTransform<Request, Promise<Request>> {
  async transform(request: Request): Promise<Request> {
    const file = request.file;

    if (file && this.isNotValidMimeType(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file mimeType. Only PDF, JPG and PNG are allowed.',
      );
    }
    return request;
  }

  isNotValidMimeType(mimeType: string) {
    return !Object.keys(MimeTypes).includes(mimeType);
  }
}
