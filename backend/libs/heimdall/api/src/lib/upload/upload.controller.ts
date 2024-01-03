import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  InternalServerErrorException,
} from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { mimeTypePipe } from '../pipes/mimeType.pipe';
import { Roles, Role, ExtendedJwtPayload } from '@backend/infrastructure';
import 'multer';

@Controller('upload')
export class uploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @Roles([Role.User, Role.Padulla, Role.Premium])
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new mimeTypePipe())
  async uploadFile(
    @Req() request: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: Number(process.env['MAX_FILE_SIZE'] as string),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!request.headers.authorization) {
      throw new InternalServerErrorException('Authorization header is missing');
    }
    const idToken = request.headers.authorization.split(' ')[1];
    const decodedToken = jwtDecode(idToken);
    const username = (decodedToken as ExtendedJwtPayload)['cognito:username'];

    return await this.uploadService.upload(
      {
        key: file.originalname,
        data: file.buffer,
        mimeType: file.mimetype,
      },
      username,
    );
  }
}
