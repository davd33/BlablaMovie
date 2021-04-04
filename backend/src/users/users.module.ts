import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlablaUser } from './entities/user.entity';
import { LoggedInUser } from './entities/logged-in-users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlablaUser, LoggedInUser])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
