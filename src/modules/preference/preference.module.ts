import { Module } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preference } from './entities/preference.entity';

@Module({
  controllers: [PreferenceController],
  providers: [PreferenceService],
  imports: [TypeOrmModule.forFeature([Preference])],
})
export class PreferenceModule {}
