import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Vote } from './vote.entity';
import { LoggedInUser } from './users/entities/logged-in-users.entity';
import { BlablaUser } from './users/entities/user.entity';
import { HttpModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        TypeOrmModule.forFeature([Movie, Vote, BlablaUser, LoggedInUser]),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'admin',
          database: 'blablamovie',
          entities: [BlablaUser, LoggedInUser, Movie, Vote],
          synchronize: true
        }),
        UsersModule
      ],
      controllers: [AppController],
      providers: [AppService, UsersService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.ping()).toBe('Hello World!');
    });
  });

});
