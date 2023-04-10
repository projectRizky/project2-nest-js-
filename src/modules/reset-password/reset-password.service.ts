import { Injectable, HttpStatus,CACHE_MANAGER,Inject } from '@nestjs/common';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';
import { getAuth,sendPasswordResetEmail,confirmPasswordReset,verifyPasswordResetCode } from 'firebase/auth';
import { ValidationResetPasswordDto } from './dto/validation-reset-password.dto';
import { getConnection } from 'typeorm';
import { Cache } from 'cache-manager';
import { Request,  Response } from 'express';
import { SendMailLogsEntity } from '../../modules/registration/entities/send_mail_logs.entity';

@Injectable()
export class ResetPasswordService {
  constructor(
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache
  ) {}
  async create(createResetPasswordDto: CreateResetPasswordDto) {
    
    const email = createResetPasswordDto['email'];
    const cache = await this.cacheManager.get(`block.${email}`).then((ress: any) => {
      if(ress){
        console.log(ress);
        const ttl = (( ress.ttl * 1000) - (Date.now() - ress.date)) / 1000;
        console.log(ttl);
        return {
          "status": false,
          "message": "to many attemps",
          "try_after": parseInt(ttl.toFixed()),
          "statusCode" : "auth/too-many-requests" 
        };
      }else{
        const datacache = this.cacheManager.get(`inc.${email}`).then((value: number) => {
          if (value == undefined) {
            
            this.cacheManager.set(`inc.${email}`, 1, { ttl: 5000 });
          }else{
            const date = Date.now();
            if (value >= 1 && value <= 3) {
              this.cacheManager.set(`block.${email}`, {"date" : date, "ttl" : 60}, { ttl: 60 });
            }else if(value >= 4 && value <= 5){
              this.cacheManager.set(`block.${email}`, {"date" : date, "ttl" : 300}, { ttl: 300 });
            }else if(value > 5){
              this.cacheManager.set(`block.${email}`, {"date" : date, "ttl" : 3600}, { ttl: 3600 });
            }
            this.cacheManager.set(`inc.${email}`, 1 + value, { ttl: 5000 });
          }
          console.log(value);
          return {
            "status": true,
          };
        }).catch((err) => {
          console.log(err);
          return {
            "status": false,
            "message": err,
            "statusCode" : err.code 
          };
        })
        return datacache;
      }
    }).catch((err) => {
      console.log(err);
      return {
        "status": false,
        "message": err,
        "statusCode" : err.code 
      };
    });
    console.log(cache)
    if(cache.status == false){
      console.log(cache.status);
      return cache;
    }
    const auth = getAuth();
    const send =  sendPasswordResetEmail(auth, email)
    .then(() => {
        return {
          "status": "success",
          "email" : email,
          "message": 'We`ve sent an email with a link to reset your password!',
        };
        
    })
    .catch((error) => {
      if (error.code == "auth/user-not-found") {
        return {
          "status": false,
          "message": "No user data matches the given identifier.",
          "statusCode" : error.code
        }
      }
  
      if (error.code == "auth/too-many-requests") {
        return {
          "status": false,
          "message": "Too Many Requests",
          "statusCode" : error.code 
        };
      }
    });
    return send;
  }
  async resetPassword(req: Request, res: Response,createResetPasswordDto: ValidationResetPasswordDto){
    const actionCode = createResetPasswordDto['action'];
 
    const auth = getAuth(); 
   
    let reset = await verifyPasswordResetCode(auth, actionCode).then((email) => {
      const accountEmail = email;

      const newPassword = createResetPasswordDto['password'];
      const confirm =confirmPasswordReset(auth, actionCode, newPassword).then((resp) => {
        const insertMailLog = getConnection()
            .createQueryBuilder()
            .insert()
            .into(SendMailLogsEntity)
            .values({
              type: 'reset',
              email: email,
            })
            .execute();
            return {
              status: 'success',
              email : email,
              message: 'Password reset has been confirmed and new password updated!!'
            }; 
      })
      return confirm
      .catch((error) => {
        return {
            status: 'failed',
            message: 'Error occurred during confirmation. The code might have expired',
            statusCode:error.code
        };
      });
    }).catch((error) => {
      return {
        status: 'failed',
        message: 'Invalid or expired action code. Ask user to try to reset the password again.',
        statusCode:error.code
      };
    });
    return reset;
  }
  
  findAll() {
    
  }

  findOne(id: number) {
    return `This action returns a #${id} resetPassword`;
  }

  update(id: number, updateResetPasswordDto: UpdateResetPasswordDto) {
    return `This action updates a #${id} resetPassword`;
  }

  remove(id: number) {
    return `This action removes a #${id} resetPassword`;
  }
}
function getASecureRandomPassword() {
  throw new Error('Function not implemented.');
}
