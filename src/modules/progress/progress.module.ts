import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../registration/entities/user.entity';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class ProgressModule {}
