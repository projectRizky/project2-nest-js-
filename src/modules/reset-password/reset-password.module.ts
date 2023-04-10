import { Module,CacheModule } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { UserEntity } from '../../modules/registration/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  controllers: [ResetPasswordController],
  providers: [
    ResetPasswordService
  ],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CacheModule.register(),
  ],
})
export class ResetPasswordModule {}
