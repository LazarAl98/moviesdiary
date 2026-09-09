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

  // Watchlista samo za ulogovanog korisnika
  getWatchlist() {
    return this.http
      .get<{
        [key: string]: WatchlistItemData;
      }>(
        `${environment.firebaseRDBUrl}/watchlist.json?auth=${this.authService.getToken()}` +
          `&orderBy="userId"&equalTo="${this.authService.getUserId()}"`,
      )
      .pipe(
        map((data) => {
          const items: WatchlistItem[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              items.push({ id: key, ...data[key] });
            }
          }
          return items;
        }),
        tap((items) => this._items.next(items)),
      );
  }

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

  // promena licne ocene / watched statusa
  updateItem(id: string, myRating: number | null, watched: boolean) {
    return this.items.pipe(
      take(1),
      switchMap((items) => {
        const existing = items.find((i) => i.id === id)!;
        const updated: WatchlistItem = { ...existing, myRating, watched };

        return this.http
          .put(
            `${environment.firebaseRDBUrl}/watchlist/${id}.json?auth=${this.authService.getToken()}`,
            updated,
          )
          .pipe(
            tap(() => {
              const updatedItems = items.map((i) =>
                i.id === id ? updated : i,
              );
              this._items.next(updatedItems);
            }),
          );
      }),
    );
  }
  //uklanjanje filma iz watchliste
  removeFromWatchlist(id: string) {
    return this.http
      .delete(
        `${environment.firebaseRDBUrl}/watchlist/${id}.json?auth=${this.authService.getToken()}`,
      )
      .pipe(
        switchMap(() => this.items),
        take(1),
        tap((items) => {
          this._items.next(items.filter((i) => i.id !== id));
        }),
      );
  }
}
