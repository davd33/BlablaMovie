import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BlablaUser } from './entities/user.entity';
import { InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(BlablaUser) private userRepo: Repository<BlablaUser>
  ) { }

  create(createUserDto: QueryDeepPartialEntity<CreateUserDto>): Promise<InsertResult> {
    return this.userRepo.insert(createUserDto);
  }

  findAll(): Promise<BlablaUser[]> {
    return this.userRepo.find();
  }

  findOne(name: string): Promise<BlablaUser> {
    return this.userRepo.findOne({
      select: ["name", "id"],
      where: { name }
    });
  }

  async exists(name: string): Promise<boolean> {
    return (await this.userRepo.count({ where: { name } })) === 1;
  }

  // logout(userName: string): boolean {

  //   const userExists = this.exists(userName);

  //   if (!userExists)
  //     throw new Error("user not found");

  //   const isUserLoggedIn = this.loggedIn(userName);

  //   if (isUserLoggedIn) {
  //     this.loggedInUsers = R.dissoc(userName, this.loggedInUsers);
  //   }

  //   return isUserLoggedIn;
  // }

  // /**
  //  * If a user exists it, log it in.
  //  */
  // login(userName: string): boolean {

  //   const userExists = this.exists(userName);
  //   console.log(this.loggedInUsers);
  //   console.log(this.users);

  //   if (!userExists)
  //     throw new Error("user not found");

  //   if (!this.loggedIn(userName) && userExists) {
  //     this.loggedInUsers[userName] = "new token";
  //   }

  //   return userExists;
  // }

  // loggedIn(userName: string): boolean {
  //   return this.loggedInUsers[userName] != undefined;
  // }

  // /**
  //  * Verify that the user name and the provided token are registered.
  //  */
  // authorized(userName: string, token: string) {
  //   return this.loggedInUsers[userName] === token;
  //  }

}
