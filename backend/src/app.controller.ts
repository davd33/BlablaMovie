import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
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
    @Body('title') title: string,
    @Body('year') year: string,
    @Body('type') type: string,
    @Body('imdbID') imdbID: string,
    @Body('poster') poster: string) {

    return await promiseOrThrow(
      () => this.appService.registerMovie({
        title, year, type, imdbID, poster
      }));
  }

}
