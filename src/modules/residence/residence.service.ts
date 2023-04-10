import { Injectable, NotFoundException } from '@nestjs/common';
import { createQueryBuilder } from 'typeorm';
import { Cities } from './entities/cities.entity';
import { Countries } from './entities/countries.entity';
import { States } from './entities/states.entity';

@Injectable()
export class ResidenceService {
  getCountry() {
    return createQueryBuilder(Countries)
      .select('id, name, iso2', 'code')
      .where('subregion = :sub', { sub: 'South-Eastern Asia' })
      .getRawMany();
  }

  async getStates(country: string) {
    const states = await createQueryBuilder(States)
      .select('id, name, iso2', 'code')
      .where('country_code = :code', { code: country })
      .getRawMany();

    if (states.length) {
      return states;
    } else {
      throw new NotFoundException();
    }
  }

  async getCities(country, state) {
    const cities = await createQueryBuilder(Cities)
      .select('id, name')
      .where('country_code = :country', { country: country })
      .andWhere('state_code = :state', { state: state })
      .getRawMany();

    if (cities.length) {
      return cities;
    } else {
      throw new NotFoundException();
    }
  }
}
