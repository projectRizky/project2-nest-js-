import { CacheModule, Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';

@Module({
  imports: [CacheModule.register()],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
