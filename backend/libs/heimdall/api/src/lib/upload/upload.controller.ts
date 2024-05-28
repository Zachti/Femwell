import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { mimeTypePipe } from '../pipes/mimeType.pipe';
import 'multer';
import { Auth, RequestWithPayload } from '@backend/auth';
import { UploadResult } from '../inetrfaces/interfaces';

@Controller('upload')
export class uploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new mimeTypePipe())
  @Auth()
  async uploadFile(
    @Req() req: RequestWithPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: Number(process.env['MAX_FILE_SIZE']!),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    return await this.uploadService.upload(
      {
        key: file.originalname,
        data: file.buffer,
        mimeType: file.mimetype,
      },
      req.body.path,
    );
  }
}
