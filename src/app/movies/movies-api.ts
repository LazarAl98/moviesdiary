import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Movie } from './movie.model';
import { map } from 'rxjs';

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface TmdbSearchResult {
  results: TmdbMovie[];
}

@Injectable({ providedIn: 'root' })
export class MoviesApiService {
  http: HttpClient = inject(HttpClient);

  //TMDB v4 read access token (JWT) ide kroz Authorization header, ne kao ?api_key=
  private headers = new HttpHeaders({
    Authorization: `Bearer ${environment.tmdbApiKey}`,
  });

  constructor() {}

  private toMovie(m: TmdbMovie): Movie {
    return {
      id: m.id.toString(),
      title: m.title,
      overview: m.overview,
      posterUrl: m.poster_path
        ? `${environment.tmdbImageUrl}${m.poster_path}`
        : 'https://placehold.co/342x513?text=No+poster',
      releaseDate: m.release_date,
      voteAverage: m.vote_average,
    };
  }
  getPopular() {
    return this.http
      .get<TmdbSearchResult>(
        `${environment.tmdbBaseUrl}/movie/popular?language=en-US&page=1`,
        { headers: this.headers },
      )
      .pipe(map((res) => res.results.map((m) => this.toMovie(m))));
  }
}
