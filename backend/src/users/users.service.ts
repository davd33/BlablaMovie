import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BlablaUser } from './entities/user.entity';
import { InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { LoggedInUser } from './entities/logged-in-users.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(BlablaUser) private userRepo: Repository<BlablaUser>,
    @InjectRepository(LoggedInUser) private loggedUserRepo: Repository<LoggedInUser>
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

  async logout(userName: string, token: string): Promise<any> {

    return await this.loggedUserRepo.delete({ token, userName });
  }

  /**
   * If a user exists it, log it in.
   */
  async login(userName: string, password: string): Promise<any> {

    const loggedInUser = new LoggedInUser();
    loggedInUser.token = uuidv4();
    loggedInUser.user = await this.userRepo.findOneOrFail({
      where: { name: userName, password }
    });
    const res = await this.loggedUserRepo.insert(loggedInUser);

    return {
      ...res,
      token: loggedInUser.token
    };
  }

  async loggedIn(name: string): Promise<boolean> {
    const res = await this.loggedUserRepo.count({ where: { name } });
    console.log('loggedIn', res);
    return res === 1;
  }

  /**
   * Verify that the user name and the provided token are registered.
   */
  async authorized(userName: string, token: string): Promise<boolean> {
    return (await this.loggedUserRepo.count({ where: { name: userName, token: token } })) === 1;
  }

}
