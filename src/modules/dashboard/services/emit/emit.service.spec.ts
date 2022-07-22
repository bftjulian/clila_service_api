import { Test, TestingModule } from '@nestjs/testing';
import { EmitService } from './emit.service';

describe('EmitService', () => {
  let service: EmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmitService],
    }).compile();

    service = module.get<EmitService>(EmitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
