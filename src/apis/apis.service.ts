import { Injectable } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Api } from './entities/api.entity';

@Injectable()
export class ApisService {
  constructor(@InjectModel(Api) private apiModel: typeof Api) {}

  async create(createApiDto: CreateApiDto): Promise<Api> {
    const result = await this.apiModel.create(createApiDto);
    return result;
  }

  getDaylyUsage() {
    return 'This action returns daily api usage';
  }

  getTopApis() {
    return 'This action returns top api users';
  }

  recordApi() {
    return 'This action records an api call';
  }

  findAll() {
    return this.apiModel.findAll();
  }
}
