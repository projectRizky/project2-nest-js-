import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import avatarholder = require('avatarholder');
import { Response } from 'express';

@Controller('avatar')
export class AvatarController {
  @Get(':name')
  getAvatar(
    @Param('name') name: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const bg_color = [
      '#00D9D9',
      '#FFF338',
      '#495464',
      '#FFB319',
      '#F9F9F9',
      '#ECFEFF',
      '#D9008F',
      '#D90034',
      '#F05454',
      '#28FFBF',
      '#61F2F5',
      '#F9B208',
      '#3800D9',
      '#370A82',
      '#22577A',
      '#E93B81',
      '#F7FF56',
      '#9D9D9D',
      '#820A60',
      '#2B2B2B',
      '#24242E',
      '#AEE6E6',
      '#94FC13',
      '#F88F01',
    ];

    const font_color = [
      '#FFFFFF',
      '#121212',
      '#FFFFFF',
      '#121212',
      '#121212',
      '#121212',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#121212',
      '#121212',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#121212',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#121212',
      '#121212',
      '#FFFFFF',
    ];

    const c_index = bg_color.length - (name.length % bg_color.length);

    const image = avatarholder.generateAvatar(name[0], {
      bgColor: bg_color[c_index],
      color: font_color[c_index],
    });

    res.set({
      'Content-Type': 'image/jpeg',
    });

    const image_array = image.split(',');

    const base64 = image_array[1];

    const buffer = Buffer.from(base64, 'base64');

    return new StreamableFile(buffer);
  }
}
