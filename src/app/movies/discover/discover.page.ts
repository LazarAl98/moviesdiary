import { Component, inject } from '@angular/core';
import {
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonMenuButton,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ViewWillEnter,
} from '@ionic/angular';
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
    RouterLink,
    MovieCardComponent,
  ],
})
export class DiscoverPage implements ViewWillEnter {
  moviesApi: MoviesApiService = inject(MoviesApiService);

  movies: Movie[] = [];
  isLoading = false;

  ionViewWillEnter() {
    this.loadPopular();
  }

  private loadPopular() {
    this.isLoading = true;
    this.moviesApi.getPopular().subscribe((movies) => {
      this.movies = movies;
      this.isLoading = false;
    });
  }
}
