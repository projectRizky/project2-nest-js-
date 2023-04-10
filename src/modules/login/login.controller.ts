import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { LoginService } from './login.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { Request, Response } from 'express';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('email')
  login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() emailLoginDto: EmailLoginDto,
  ) {
    return this.loginService.login(req, res, emailLoginDto);
  }
}
