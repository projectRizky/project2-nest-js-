import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ResidenceService } from './residence.service';

@Controller('residence')
export class ResidenceController {
  constructor(private readonly residenceService: ResidenceService) {}
  @Get('countries')
  getCountry() {
    // asean countries\
    return this.residenceService.getCountry();
  }

  @Get('states')
  getStates(@Query() param: { country: string }) {
    if (param.country != null) {
      const country = param.country.toUpperCase();
      return this.residenceService.getStates(country);
    } else {
      throw new NotFoundException();
    }
  }

  @Get('cities')
  getCities(@Query() param: { country: string; state: string }) {
    if (param.country != null && param.state != null) {
      const country = param.country.toUpperCase();
      const state = param.state.toUpperCase();
      return this.residenceService.getCities(country, state);
    } else {
      throw new NotFoundException();
    }
  }
}
