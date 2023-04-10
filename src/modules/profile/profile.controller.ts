import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';

@Controller('account/profile/me')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findAll(@Req() req: Request, @Query() getProfileDto) {
    let get = 'simple';
    if (getProfileDto.get == 'simple' || getProfileDto.get == 'full') {
      get = getProfileDto.get;
    }
    console.log(get);
    return this.profileService.findAll(req, get);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch()
  update(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(req, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
