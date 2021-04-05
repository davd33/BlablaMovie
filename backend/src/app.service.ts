import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { assert } from './utils';
import { Movie } from './movie.entity';
import { Between, Repository } from 'typeorm';
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

  /**
   * Vote for a movie or unvote it.
   */
  async vote(imdbID: string, userName: string) {

    const movie = await this.movieRepo.findOneOrFail({ where: { imdbID } });

    // We count votes for the current week/user/movie
    const now = new Date();
    const today = new Date(`${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`);
    const mondayThisWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const sundayThisWeek = new Date(today.setDate(today.getDate() + 7));
    sundayThisWeek.setTime(sundayThisWeek.getTime() - 1)

    const foundVote = await this.voteRepo.count({
      where: {
        userName,
        movie,
        timestampWithTimezone: Between(mondayThisWeek, sundayThisWeek)
      }
    });

    if (foundVote === 0) {
      this.voteRepo.insert({ userName, movie });
    } else {
      this.voteRepo.delete({ userName, movie })
    }
    return { movie, foundVote };
  }

  /**
   * Add a movie into our internal movie DB.
   */
  async registerMovie(movieDto: any) {
    return await this.movieRepo.insert(movieDto);
  }
}
