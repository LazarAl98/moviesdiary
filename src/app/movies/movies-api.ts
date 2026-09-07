import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Movie } from './movie.model';

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
}
