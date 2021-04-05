import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { assert, weekPeriod } from './utils';
import { Movie } from './movie.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './vote.entity';

@Injectable()
export class AppService {

  constructor(
    private http: HttpService,
    @InjectRepository(Movie) private movieRepo: Repository<Movie>,
    @InjectRepository(Vote) private voteRepo: Repository<Vote>) { }

  private searchUrl(key: string, search: string): string {
    assert(() => key.length > 0);
    return `http://www.omdbapi.com/?apikey=${key}&type=movie&s=${search}`;
  }

  async searchMovie(title: string, userName: string) {
    const OMDb_KEY = process.env.OMDb_KEY;
    const omdbResult = await this.http.get(this.searchUrl(OMDb_KEY, title)).toPromise();

    if (omdbResult.data.Response === "False") {
      return omdbResult.data;
    }

    let data = omdbResult.data;
    if (omdbResult.data !== undefined)
      data = {
        ...omdbResult.data,
        Search: await Promise.all(omdbResult.data.Search.map(async (m: any) => {

          const { monday, sunday } = weekPeriod(new Date());
          const movie: Movie = await this.movieRepo.findOne({ where: { imdbID: m.imdbID } });
          return {
            ...m,
            voted: (await this.voteRepo.count({
              where: {
                userName,
                movie,
                timestampWithTimezone: Between(monday, sunday)
              }
            })) === 1
          };
        }))
      };

    return data;
  }

  async winnerCurrentWeek() {
    const { monday, sunday } = weekPeriod(new Date());
    return await this.voteRepo.createQueryBuilder('vote')
      .select('count(*)')
      .leftJoinAndSelect("vote.movie", "m")
      .where(`vote.timestampWithTimezone between '${monday.toISOString()}' and '${sunday.toISOString()}'`)
      .groupBy('m.id')
      .limit(1)
      .getRawMany();
  }

  /**
   * Vote for a movie or unvote it.
   */
  async vote(imdbID: string, userName: string) {

    const movie = await this.movieRepo.findOneOrFail({ where: { imdbID } });

    // We count votes for the current week/user/movie
    const { monday, sunday } = weekPeriod(new Date());

    const foundVote = await this.voteRepo.count({
      where: {
        userName,
        movie,
        timestampWithTimezone: Between(monday, sunday)
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

  async votesLeft(userName: string) {

    const MAX_NUMBER_OF_VOTES = 3;

    const { monday, sunday } = weekPeriod(new Date());
    const votesMadeCurrentWeek = await this.voteRepo.count({
      where: {
        userName,
        timestampWithTimezone: Between(monday, sunday)
      }
    });

    return Math.max(0, Math.min(
      MAX_NUMBER_OF_VOTES, MAX_NUMBER_OF_VOTES - votesMadeCurrentWeek));
  }
}
