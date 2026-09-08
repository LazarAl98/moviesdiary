import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';
import { Movie } from '../../movie.model';
import { MoviesApiService } from '../../movies-api';
import { WatchlistService } from '../../watchlist';
import { WatchlistItem } from '../../watchlist-item.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    DecimalPipe,
  ],
})
export class MovieDetailsPage implements OnInit, OnDestroy {
  route: ActivatedRoute = inject(ActivatedRoute);
  moviesApi: MoviesApiService = inject(MoviesApiService);
  watchlistService: WatchlistService = inject(WatchlistService);

  movie?: Movie;
  isLoading = false;

  private subs = new Subscription();

  constructor() {
    addIcons({ star });
  }

  ngOnInit() {
    this.subs.add(
      this.route.paramMap.subscribe((paramMap) => {
        const id = paramMap.get('movieId');
        if (!id) return;

        this.isLoading = true;
        this.subs.add(
          this.moviesApi.getMovieDetails(id).subscribe((movie) => {
            this.movie = movie;
            this.isLoading = false;
          }),
        );
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
