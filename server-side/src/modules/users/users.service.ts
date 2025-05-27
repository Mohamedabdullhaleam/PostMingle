import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { validateId } from 'src/common/utils/validate-id.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<Partial<UserDocument>>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<UserDocument>> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email }).lean().exec();
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });
    newUser.save();
    const { _id } = newUser;
    return { _id, username, email };
  }

  async findById(id: string): Promise<Partial<UserDocument>> {
    validateId(id);
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { _id, username, email } = user;
    return { _id, username, email };
  }

  async findByemail(email: string): Promise<Partial<UserDocument>> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
