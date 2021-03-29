import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { assert } from './utils';

@Injectable()
export class AppService {

  constructor(private http: HttpService) { }

  private searchUrl(key: string, search: string): string {
    assert(() => key.length > 0);
    return `http://www.omdbapi.com/?apikey=${key}&type=movie&s=${search}`;
  }

  searchMovie(title: string): Observable<any> {
    const OMDb_KEY = process.env.OMDb_KEY;
    return this.http.get(this.searchUrl(OMDb_KEY, title))
      .pipe(map(r => r.data));
  }
}
