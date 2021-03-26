class MovieBuilder {
  private movie: Movie;

  constructor() {
    this.movie = new Movie();
  }

  public title(name: string): MovieBuilder {
    this.movie.title = name;
    return this;
  }

  public build() {
    return this.movie;
  }
}

export class Movie {

  public title: string

  constructor() { }

  public static builder() {
    return new MovieBuilder();
  }
}
