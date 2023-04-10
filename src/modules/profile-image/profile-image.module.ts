import { Module } from '@nestjs/common';
import { ProfileImageService } from './profile-image.service';
import { ProfileImageController } from './profile-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../registration/entities/user.entity';

@Module({
  controllers: [ProfileImageController],
  providers: [ProfileImageService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class ProfileImageModule {}
