import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlablaUser } from './users/entities/user.entity';
import { LoggedInUser } from './users/entities/logged-in-users.entity';
import { Movie } from './movie.entity';
import { Vote } from './vote.entity';
import { UsersService } from './users/users.service';

@Module({
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
})
export class AppModule { }
