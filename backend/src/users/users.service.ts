import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  private users: any = {};

  create(createUserDto: CreateUserDto) {
    if (this.users[createUserDto.name]) {
      return { err: "user already exists" }
    } else {
      this.users[createUserDto.name] = new User(createUserDto.name);
      return this.users[createUserDto.name];
    }
  }

  findAll() {
    return { ...this.users };
  }

  findOne(name: string) {
    return this.users[name] || { err: "user not found" };
  }

}
