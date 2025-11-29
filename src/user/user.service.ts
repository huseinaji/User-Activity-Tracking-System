import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from '../auth/dto/login.dto';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { jwtPayload } from 'src/common/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly jwtservice: JwtService
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    //check email uniqueness
    await this.validateUserSignup(dto)
    const hasehedPass = await this.hashPassword(dto.password)

    dto.password = hasehedPass;
    const createdUser = await this.userModel.create(dto)
    return createdUser
  }

  async getCurrentUser(dto: jwtPayload) {
    return await this.userModel.findByPk(dto.userId)
  }

  async findAllUser() {
    return await this.userModel.findAll()
  }

  async deleteUser(user: jwtPayload) {
    return await this.userModel.destroy({where: {id: user.userId}})
  }

  private async createUserData() {
    const userCount = await this.userModel.count();
    if (userCount > 0) return;
    const hash = await bcrypt.hash('admin123', 10);
    const users = { 
      username: 'admin', 
      email: 'admin@mail.com', 
      password: hash,
      isActive: true
    };
    await this.userModel.create(users);
    console.log('Default admin user created');
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({where: { email: email} });
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ where: {username: username }});
  }

  private async validateUserSignup(dto: SignUpDto) {
    const existingEmail = this.userModel.findOne({where: {email: dto.email} })
    if (!existingEmail) throw new ConflictException('Email already exist')
    const existingUsername = await this.userModel.findOne({ where: { username: dto.username }});
    if (existingUsername) throw new ConflictException('Username already exists');
  }

  private async hashPassword(rawPass): Promise<string> {
    const result = await bcrypt.hash(rawPass, 10) 
    return result
  }

  onModuleInit() {
    this.createUserData()
  }
}
