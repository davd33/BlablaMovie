import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { promiseOrThrow } from 'src/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { BlablaUser } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return await promiseOrThrow(
      () => this.usersService.create(createUserDto));
  }

  @Get()
  async findAll(): Promise<BlablaUser[]> {
    return await promiseOrThrow(
      () => this.usersService.findAll());
  }

  @Get(':name')
  async findOne(@Param('name') name: string): Promise<BlablaUser> {
    return await promiseOrThrow(
      () => this.usersService.findOne(name));
  }

}
