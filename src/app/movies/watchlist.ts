import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth';
import { WatchlistItem } from './watchlist-item.model';
import { Movie } from './movie.model';

interface WatchlistItemData {
  movieId: string;
  title: string;
  posterUrl: string;
  userId: string | null;
  myRating: number | null;
  watched: boolean;
}

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private _items = new BehaviorSubject<WatchlistItem[]>([]);

  get items() {
    return this._items.asObservable();
  }

  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  constructor() {}

  //dodavanje filma u watchlist, cuva se referenca i ocena
  addToWatchlist(movie: Movie, myRating: number | null, watched: boolean) {
    const userId = this.authService.getUserId();
    const payload: WatchlistItemData = {
      movieId: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      userId,
      myRating,
      watched,
    };

    return this.http
      .post<{
        name: string;
      }>(
        `${environment.firebaseRDBUrl}/watchlist.json?auth=${this.authService.getToken()}`,
        payload,
      )
      .pipe(
        switchMap((res) =>
          this.items.pipe(
            take(1),
            tap((items) => {
              this._items.next(items.concat({ id: res.name, ...payload }));
            }),
          ),
        ),
      );
  }
}
