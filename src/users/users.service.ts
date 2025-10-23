import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    public userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.userModel.create(userData);
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }
}
