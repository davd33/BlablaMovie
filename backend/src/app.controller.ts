import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { promiseOrThrow } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly usersService: UsersService) { }

  @Post('find-movie')
  async getFindMovie(
    @Query('movieName') movie: string,
    @Body('userName') userName: string,
    @Body('token') token: string
  ) {
    return await promiseOrThrow(
      { userName, token },
      this.usersService,
      () => this.appService.searchMovie(movie, userName));
  }

  @Post('vote/:imdbID')
  async voteForMovie(
    @Param('imdbID') imdbID: string,
    @Body('userName') userName: string,
    @Body('token') token: string
  ) {
    return await promiseOrThrow(
      { userName, token },
      this.usersService,
      () => this.appService.vote(imdbID, userName));
  }

  @Post('register-movie')
  async registerMovie(
    @Body('Title') title: string,
    @Body('Year') year: string,
    @Body('Type') type: string,
    @Body('imdbID') imdbID: string,
    @Body('Poster') poster: string,
    @Body('userName') userName: string,
    @Body('token') token: string
  ) {

    return await promiseOrThrow(
      { userName, token },
      this.usersService,
      () => this.appService.registerMovie({
        title, year, type, imdbID, poster
      }));
  }

}
