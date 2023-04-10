import { Controller, Get, Body, Patch, Param, Req } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { Request } from 'express';

@Controller('account/preference')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Get()
  findAll(@Req() req: Request) {
    return this.preferenceService.findAll(req);
  }

  @Patch()
  update(
    @Req() req: Request,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
  ) {
    return this.preferenceService.update(req, updatePreferenceDto);
  }
}
