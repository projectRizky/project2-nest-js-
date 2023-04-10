import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';
import { UserEntity } from '../registration/entities/user.entity';

@Injectable()
export class ProfileImageService {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  AWS_S3_PATH = process.env.AWS_S3_FOLDER;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    // region: process.env.AWS_S3_BUCKET_REGION,
    // endpoint: process.env.AWS_URL,
  });

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async uploadFile(userId, file) {
    // if (file) {
    const upload = await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      userId,
      file.mimetype,
      this.AWS_S3_PATH,
    );
    admin.auth().updateUser(userId, {
      photoURL: upload.Location,
    });

    this.userRepo.update({ id: userId }, { avatar: upload.Location });

    return {
      status: true,
      message: 'profile updated successfully',
      data: {
        user_id: userId,
        photoURL: upload.Location,
      },
    };
    // } else {
    //   return new BadRequestException('avatar wajib diisi').getResponse();
    // }
  }

  async deleteImage(req: Request) {
    const host = req.protocol + '://' + req.get('host');

    const userId = req['user'].uid;

    const deleteAvatar = await this.s3
      .deleteObject({
        Bucket: this.AWS_S3_BUCKET,
        Key: String(`${this.AWS_S3_PATH}/profile/${userId}`),
      })
      .promise();

    console.log(deleteAvatar);

    this.userRepo.update({ id: userId }, { avatar: null });

    const user = await this.userRepo.findOne(userId);

    return {
      status: true,
      message: 'image delete successfuly',
      data: {
        photoUrl: host + '/avatar/' + user.username,
        isDefaultPhoto: true,
      },
    };
  }

  async s3_upload(file, bucket, name, mimetype, path) {
    const params = {
      Bucket: bucket,
      Key: String(`${path}/profile/${name}`),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_S3_BUCKET_REGION,
      },
    };

    console.log(params);

    try {
      const s3Response = await this.s3.upload(params).promise();

      console.log(s3Response);
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
