import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { ProgressService } from './progress.service';

@Controller('account/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getProgress(@Req() req: Request) {
    return this.progressService.getProgress(req);
  }
}
