import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { createQueryBuilder, Repository } from 'typeorm';
import { UserEntity } from '../registration/entities/user.entity';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { Preference } from './entities/preference.entity';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(Preference)
    private preferenceRepo: Repository<Preference>,
  ) {}

  async findAll(req: Request) {
    const userId = req['user'].uid;

    const user = await createQueryBuilder(UserEntity)
      .select('created_at')
      .where('id = :uid', { uid: userId })
      .getRawOne();

    if (user) {
      const preference = await createQueryBuilder(Preference)
        .where('user_id = :uid', { uid: userId })
        .getRawOne();

      return {
        status: true,
        data: {
          emailNotification: preference
            ? Boolean(preference.Preference_email_notification)
            : false,
          language: preference ? preference.Preference_languange : 'id',
          joinedSince: user.created_at,
        },
      };
    } else {
      throw new NotFoundException();
    }
  }

  async update(req: Request, updatePreferenceDto: UpdatePreferenceDto) {
    const user_id = req['user'].uid;

    const update = await this.preferenceRepo.save({
      userId: user_id,
      emailNotification: updatePreferenceDto.emailNotification,
      language: updatePreferenceDto.language,
    });

    return {
      status: true,
      data: {
        emailNotification: Boolean(update.emailNotification),
        language: update.language,
      },
    };
  }
}
