import { HttpService, Injectable } from '@nestjs/common';
import { Movie } from './movie.model';
import { map } from 'rxjs/operators';
import { identity, Observable } from 'rxjs';

@Injectable()
export class AppService {

  constructor(private http: HttpService) { }

  private searchUrl(key: string, search: string): string {
    return `http://www.omdbapi.com/?apikey=${key}&type=movie&s=${search}`;
  }

  searchMovie(title: string): Observable<any> {
    const OMDb_KEY = process.env.OMDb_KEY;
    return this.http.get(this.searchUrl(OMDb_KEY, title))
      .pipe(map(r => r.data));
  }
}
