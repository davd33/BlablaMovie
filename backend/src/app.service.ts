import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { assert } from './utils';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {

  constructor(private http: HttpService,
    private users: UsersService,
    @InjectRepository(Movie) private movieRepo: Repository<Movie>,
    @InjectRepository(Vote) private voteRepo: Repository<Vote>) { }

  private searchUrl(key: string, search: string): string {
    assert(() => key.length > 0);
    return `http://www.omdbapi.com/?apikey=${key}&type=movie&s=${search}`;
  }

  searchMovie(title: string): Observable<any> {
    const OMDb_KEY = process.env.OMDb_KEY;
    return this.http.get(this.searchUrl(OMDb_KEY, title))
      .pipe(map(r => r.data));
  }

  async vote(imdbID: string, userName: string, token: string) {
    const auth = await this.users.authorized(userName, token);
    console.log(auth);

    const movie = await this.movieRepo.findOneOrFail({ where: { imdbID } });
    console.log(movie);

    const vote = await this.voteRepo.count({ where: { userName, movie } });
    console.log(vote)

    if (vote === 0) {
      this.voteRepo.insert({
        userName,
        movie
      });
    }
    return { movie, vote };
  }

  async registerMovie(movieDto: any) {
    return await this.movieRepo.insert(movieDto);
  }
}
