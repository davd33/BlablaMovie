import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('find-movie')
  getFindMovie(@Query('movieName') movie: string): Observable<any> {
    return this.appService.searchMovie(movie);
  }

}
