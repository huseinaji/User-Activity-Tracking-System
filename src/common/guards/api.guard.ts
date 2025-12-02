import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from '../schema/client.schema';
import { hashApiKey } from '../utils';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(@InjectModel(Client) private clientModel: typeof Client) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const headers = req.headers
    const hashedApiKey = hashApiKey(headers['api-key'])
    console.log('hashed api key', hashedApiKey)
    const client = await this.clientModel.findOne({where: {api_key: hashedApiKey}})
    if (!client) throw new NotFoundException('Api key not found')

    return true;
  }
}
