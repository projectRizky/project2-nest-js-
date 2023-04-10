import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { createQueryBuilder, Repository } from 'typeorm';
import { UserEntity } from '../registration/entities/user.entity';
import { Cities } from '../residence/entities/cities.entity';
import { Countries } from '../residence/entities/countries.entity';
import { States } from '../residence/entities/states.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as admin from 'firebase-admin';
import * as moment from 'moment';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findAll(req: Request, get: string) {
    const userId = req['user'].uid;

    const host = req.protocol + '://' + req.get('host');

    const user = await this.userRepo.findOne(userId);

    if (user) {
      if (get === 'simple') {
        return {
          status: true,
          data: {
            user_id: user.id,
            photoURL: user.avatar
              ? user.avatar
              : host + '/avatar/' + user.username,
            fullName: user.fullName,
            userName: user.username,
          },
        };
      } else {
        const country = await createQueryBuilder()
          .select([
            'country.name',
            'country.iso2',
            'state.name',
            'state.iso2',
            'city.name',
          ])
          .from(Countries, 'country')
          .innerJoin(States, 'state', 'state.country_id = country.id')
          .leftJoin(
            Cities,
            'city',
            'city.country_id = country.id and city.state_id = state.id and city.id = :cityId',
            { cityId: user.citiesId },
          )
          .where('country.id = :id', { id: user.countriesId })
          .andWhere('state.id = :stateId', { stateId: user.statesId })
          .getRawOne();

        return {
          status: true,
          data: {
            user_id: user.id,
            photoURL: user.avatar
              ? user.avatar
              : host + '/avatar/' + user.username,
            isDefaultPhoto: user.avatar ? false : true,
            fullName: user.fullName,
            userName: user.username,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender === 'undefined' ? null : user.gender,
            residence: {
              country: {
                id: user.countriesId,
                name: country ? country.country_name : null,
                code: country ? country.country_iso2 : null,
              },
              province: {
                id: user.statesId,
                name: country ? country.state_name : null,
                code: country ? country.state_iso2 : null,
              },
              city: {
                id: user.citiesId,
                name: country ? country.city_name : null,
              },
              address: user.address,
            },
          },
        };
      }
    } else {
      throw new NotFoundException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async update(req: Request, updateProfileDto: UpdateProfileDto) {
    const userId = req['user'].uid;

    const host = req.protocol + '://' + req.get('host');

    let message = 'profile updated successfully';

    const moments = moment(updateProfileDto.dateOfBirth).format(
      'YYYY-MM-DD h:m:s',
    );

    console.log(moments);

    const updateUser = await this.userRepo
      .update(
        { id: userId },
        {
          fullName: updateProfileDto.fullName,
          username: updateProfileDto.username,
          dateOfBirth: moments,
          gender: updateProfileDto.gender,
          countriesId: updateProfileDto.countriesId,
          statesId: updateProfileDto.statesId,
          citiesId: updateProfileDto.citiesId,
          address: updateProfileDto.address,
        },
      )
      .catch((e) => {
        if (/QueryFailedError: ER_DUP_ENTRY: Duplicate entry/.test(e)) {
          message = 'profile update failed, username already used';
        }
      });

    await admin
      .auth()
      .updateUser(userId, { displayName: updateProfileDto.fullName })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully updated user', userRecord.toJSON());
      })
      .catch((error) => {
        console.log('Error updating user:', error);
      });

    const user = await this.userRepo.findOne(userId);

    const country = await createQueryBuilder()
      .select([
        'country.name',
        'country.iso2',
        'state.name',
        'state.iso2',
        'city.name',
      ])
      .from(Countries, 'country')
      .innerJoin(States, 'state', 'state.country_id = country.id')
      .leftJoin(
        Cities,
        'city',
        'city.country_id = country.id and city.state_id = state.id and city.id = :cityId',
        { cityId: user.citiesId },
      )
      .where('country.id = :id', { id: user.countriesId })
      .andWhere('state.id = :stateId', { stateId: user.statesId })
      .getRawOne();

    return {
      status: updateUser ? true : false,
      message: message,
      data: {
        user_id: user.id,
        photoURL: user.avatar ? user.avatar : host + '/avatar/' + user.username,
        isDefaultPhoto: user.avatar ? false : true,
        fullName: user.fullName,
        userName: user.username,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender === 'undefined' ? null : user.gender,
        residence: {
          country: {
            id: user.countriesId,
            name: country ? country.country_name : null,
            code: country ? country.country_iso2 : null,
          },
          province: {
            id: user.statesId,
            name: country ? country.state_name : null,
            code: country ? country.state_iso2 : null,
          },
          city: {
            id: user.citiesId,
            name: country ? country.city_name : null,
          },
          address: user.address,
        },
      },
    };
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
