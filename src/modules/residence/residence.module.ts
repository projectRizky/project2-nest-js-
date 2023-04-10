import { Module } from '@nestjs/common';
import { ResidenceService } from './residence.service';
import { ResidenceController } from './residence.controller';

@Module({
  controllers: [ResidenceController],
  providers: [ResidenceService],
})
export class ResidenceModule {}
