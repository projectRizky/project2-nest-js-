import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class RegistThirdPartyValidatorMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.header('Authorization').split(' ').length == 2) {
        const userToken = req.header('Authorization').split(' ');
        const verifyToken = await admin
          .auth()
          .verifyIdToken(userToken[1])
          .then((decodedToken) => {

            return {
              status: true,
              message: 'This token is valid',
              user: decodedToken,
            };
          })
          .catch((error) => {

            // Handle error
            return {
              status: false,
              message: 'This token is not valid',
              user: null,
            };
          });

        if (verifyToken.status) {
          res.locals = verifyToken.user;
          next();
        } else {
          throw new UnauthorizedException({
            status: false,
            message: 'Unauthorized',
          });
        }
      } else {
        throw new UnauthorizedException({
          status: false,
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      throw new UnauthorizedException({
        status: false,
        message: 'Unauthorized',
      });
    }
  }
}
