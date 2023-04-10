import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../registration/entities/user.entity';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';

@Module({
  controllers: [ValidationController],
  providers: [ValidationService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class ValidationModule {}
