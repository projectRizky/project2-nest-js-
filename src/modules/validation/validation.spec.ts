import { Test, TestingModule } from '@nestjs/testing';
import { Validation } from './validation.service';

describe('Validation', () => {
  let provider: Validation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Validation],
    }).compile();

    provider = module.get<Validation>(Validation);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
