import { Test, TestingModule } from '@nestjs/testing';
import { ResidenceService } from './residence.service';

describe('ResidenceService', () => {
  let service: ResidenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResidenceService],
    }).compile();

    service = module.get<ResidenceService>(ResidenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
