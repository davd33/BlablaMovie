import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { NO_AUTH_REQUIRED, promiseOrThrow } from 'src/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return await promiseOrThrow(
      NO_AUTH_REQUIRED,
      this.usersService,
      () => this.usersService.create(createUserDto));
  }

  @Post('login')
  async login(@Body('userName') userName: string, @Body('password') password: string) {
    return await promiseOrThrow(
      NO_AUTH_REQUIRED,
      this.usersService,
      () => this.usersService.login(userName, password));
  }

  @Post('logout')
  async logout(@Body('userName') userName: string, @Body('token') token: string) {
    return await promiseOrThrow(
      { userName, token },
      this.usersService,
      () => this.usersService.logout(userName, token));
  }

}
