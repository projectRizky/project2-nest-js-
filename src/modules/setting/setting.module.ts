import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/registration/entities/user.entity';

@Module({
  controllers: [SettingController],
  providers: [SettingService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class SettingModule {}
