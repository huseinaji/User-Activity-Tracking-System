import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from 'src/common/schema/client.schema';
import { ClientRegisterDto } from './dto/client-register.dto';
import * as crypto from 'crypto';
import { CreationAttributes } from 'sequelize';
import { hashApiKey } from 'src/common/utils';
import { isEmail } from 'class-validator';

@Injectable()
export class ClientService {
  constructor(@InjectModel(Client) private readonly clientModel: typeof Client){}
  
  async register(dto: ClientRegisterDto) {
    await this.validateClient(dto)
    const originalApiKey = this.createApiKey()
    const hashedApiKey = hashApiKey(originalApiKey)
    console.log(hashedApiKey)
    const clientData:CreationAttributes<Client> = {
      ...dto,
      password: 'tes',
      apiKey: hashedApiKey,
    }

    const client = await this.clientModel.create(clientData)
    let result = client.toJSON();
    result.apiKey = originalApiKey
    return result
  }

  async findAllClient(): Promise<Client[]>{
    return this.clientModel.findAll()
  }

  createApiKey() {
    const rand = crypto.randomBytes(36).toString('base64')
    return rand
  }

  async validateClient(dto: ClientRegisterDto) {
    const emailExist = await this.clientModel.findOne({
      where: {
        email: dto.email
      }
    })
    if (emailExist) throw new ConflictException('Email already use')
  }
}
