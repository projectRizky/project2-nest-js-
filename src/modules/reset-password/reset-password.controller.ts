import { Controller, Get, Post, Body, Patch, Param, Delete,Res,HttpStatus,Req,UsePipes,HttpCode} from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';
import { ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { ValidationResetPasswordDto } from './dto/validation-reset-password.dto';








@Controller('password')
export class ResetPasswordController {

  constructor(
    private readonly resetPasswordService: ResetPasswordService
    
    ) {}

  @Post('reset-request')
  @HttpCode(200)
  @UsePipes(
     new ValidationPipe({
      whitelist: true,
      transform: true,
    })
    )
    

  async create(@Body() createResetPasswordDto: CreateResetPasswordDto,@Res({ passthrough: true }) res: Response):  Promise<any> {
    const result = await this.resetPasswordService.create(createResetPasswordDto);
    if(result['statusCode'] == "auth/user-not-found"){
      res.status(HttpStatus.UNAUTHORIZED);
    }else if(result['statusCode'] == "auth/too-many-requests"){
      res.status(HttpStatus.TOO_MANY_REQUESTS)
    }
    return result
  }
  
  @Post('reset-password')
  @HttpCode(200)
  @UsePipes(
     new ValidationPipe({
      whitelist: true,
      transform: true,
    })
    )
    async reset_password(@Body() ValidationResetPasswordDto: ValidationResetPasswordDto,@Res({ passthrough: true }) res: Response,@Req() req: any):  Promise<any> {
      const result = await this.resetPasswordService.resetPassword(req,res,ValidationResetPasswordDto); 
      if(result['status'] == "failed"){
        res.status(HttpStatus.UNAUTHORIZED);
      }
      return result;
      
    }
  @Post('testing')
  findAll() {
    return this.resetPasswordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resetPasswordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResetPasswordDto: UpdateResetPasswordDto) {
    return this.resetPasswordService.update(+id, updateResetPasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resetPasswordService.remove(+id);
  }
}
function New(New: any, arg1: any) {
  throw new Error('Function not implemented.');
}

