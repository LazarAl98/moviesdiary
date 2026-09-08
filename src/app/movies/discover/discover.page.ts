import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonMenuButton,
  IonRow,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Movie } from '../movie.model';
import { MoviesApiService } from '../movies-api';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonSearchbar,
    RouterLink,
    MovieCardComponent,
  ],
})
export class DiscoverPage implements ViewWillEnter, OnDestroy {
  moviesApi: MoviesApiService = inject(MoviesApiService);

  movies: Movie[] = [];
  isLoading = false;
  private searchSub?: Subscription;

  ionViewWillEnter() {
    this.loadPopular();
  }

  onSearch(event: CustomEvent) {
    const query = ((event.detail.value as string) || '').trim();

    this.searchSub?.unsubscribe();

    if (!query) {
      this.loadPopular();
      return;
    }

    this.isLoading = true;
    this.searchSub = this.moviesApi.searchMovies(query).subscribe((movies) => {
      this.movies = movies;
      this.isLoading = false;
    });
  }

  private loadPopular() {
    this.isLoading = true;
    this.moviesApi.getPopular().subscribe((movies) => {
      this.movies = movies;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }
}
