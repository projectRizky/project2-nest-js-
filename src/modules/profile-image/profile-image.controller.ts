import {
  Controller,
  Delete,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileImageService } from './profile-image.service';
import { Express, Request } from 'express';
import { imageFileFilter } from './image-filter';

@Controller('account')
export class ProfileImageController {
  constructor(private readonly profileImageService: ProfileImageService) {}

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 5000000 },
      fileFilter: imageFileFilter,
    }),
  )
  uploadImage(
    @Req() req: Request,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const userId = req['user'].uid;
    console.log('avatar');
    console.log(avatar.size);

    return this.profileImageService.uploadFile(userId, avatar);
  }

  @Delete('profile/me')
  deleteImage(@Req() req: Request) {
    return this.profileImageService.deleteImage(req);
  }
}
