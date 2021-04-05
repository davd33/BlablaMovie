import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { promiseOrThrow } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('find-movie')
  getFindMovie(@Query('movieName') movie: string): Observable<any> {
    return this.appService.searchMovie(movie);
  }

  @Post('vote/:imdbID')
  async voteForMovie(
    @Param('imdbID') imdbID: string,
    @Body('userName') userName: string,
    @Body('token') token: string
  ) {
    return await promiseOrThrow(
      () => this.appService.vote(imdbID, userName, token));
  }

  @Post('register-movie')
  async registerMovie(
    @Body('Title') title: string,
    @Body('Year') year: string,
    @Body('Type') type: string,
    @Body('imdbID') imdbID: string,
    @Body('Poster') poster: string) {

    return await promiseOrThrow(
      () => this.appService.registerMovie({
        title, year, type, imdbID, poster
      }));
  }

}
