import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, checkmarkCircle, timeOutline } from 'ionicons/icons';
import { Movie } from '../../movie.model';
import { MoviesApiService } from '../../movies-api';
import { WatchlistService } from '../../watchlist';
import { WatchlistItem } from '../../watchlist-item.model';
import { RatingModalComponent } from '../../rating-modal/rating-modal.component';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonItem,
    IonLabel,
    ModalController,
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
  modalCtrl: ModalController = inject(ModalController);

  movie?: Movie;
  watchlistEntry: WatchlistItem | null = null;
  isLoading = false;

  private subs = new Subscription();

  constructor() {
    addIcons({
      star,
      'checkmark-circle': checkmarkCircle,
      'time-outline': timeOutline,
    });
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
        this.watchlistService.getWatchlist().subscribe();
        this.subs.add(
          this.watchlistService.items.subscribe((items) => {
            this.watchlistEntry = items.find((i) => i.movieId === id) ?? null;
          }),
        );
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  async onAddOrEdit() {
    if (!this.movie) return;

    const modal = await this.modalCtrl.create({
      component: RatingModalComponent,
      componentProps: {
        title: this.watchlistEntry ? 'Edit rating' : 'Add to watchlist',
        myRating: this.watchlistEntry?.myRating ?? null,
        watched: this.watchlistEntry?.watched ?? false,
      },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role !== 'confirm' || !this.movie) return;

    const movieId = this.movie.id;
    const movie = this.movie;

    this.watchlistService.getWatchlist().subscribe((items) => {
      const existing = items.find((i) => i.movieId === movieId);
      if (existing) {
        this.watchlistService
          .updateItem(existing.id, data.myRating, data.watched)
          .subscribe();
      } else {
        this.watchlistService
          .addToWatchlist(movie, data.myRating, data.watched)
          .subscribe();
      }
    });
  }
}
