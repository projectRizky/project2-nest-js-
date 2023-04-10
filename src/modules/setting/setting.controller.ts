import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { EmailAdd } from './dto/email-add.dto';
import { EmailChange } from './dto/email-change.dto';
import { PasswordChange } from './dto/password-change.dto';
import { PhoneAdd } from './dto/phone-add.dto';
import { SettingService } from './setting.service';

@Controller('account/setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  getSetting(@Req() req: Request) {
    return this.settingService.getSetting(req);
  }

  @Post('email')
  addEmail(@Req() req: Request, @Body() body: EmailAdd) {
    return this.settingService.addEmail(req, body);
  }

  @Post('phone')
  addPhone(@Req() req: Request, @Body() body: PhoneAdd) {
    return this.settingService.addPhoneNumber(req, body);
  }

  @Patch('email')
  changeEmail(@Req() req: Request, @Body() body: EmailChange) {
    return this.settingService.changeEmail(req, body);
  }

  @Patch('password')
  updateSetting(@Req() req: Request, @Body() body: PasswordChange) {
    return this.settingService.changePassword(req, body);
  }
}
