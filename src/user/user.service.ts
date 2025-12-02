import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { User } from 'src/common/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({where: {email: email} });
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ where: {username: username} });
  }

  async createUser(data: {email: string} & Record<string, any>): Promise<User> {
    const emailExist = await this.userModel.findOne({where: {email: data.email}})
    if (emailExist) throw new ConflictException('Email exist, admin has been created')
    return await this.userModel.create<User>({...data})
  }
}
