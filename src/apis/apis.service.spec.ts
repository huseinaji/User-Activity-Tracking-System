import { Test, TestingModule } from '@nestjs/testing';
import { ApisService } from './apis.service';

describe('ApisService', () => {
  let service: ApisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApisService],
    }).compile();

    service = module.get<ApisService>(ApisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create an api record', async () => {
    const createApiDto = {
      client_id: 'client123',
      name: 'Test API',
      email: 'test@gmail.com',
      api_key: 'apikey123',
    };
    const api = await service.create(createApiDto);
    expect(api).toMatchObject(createApiDto);
  })

});
