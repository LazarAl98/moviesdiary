import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  LoadingController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { WatchlistService } from '../watchlist';
import { WatchlistItem } from '../watchlist-item.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonAvatar,
    IonImg,
    IonLabel,
    RouterLink,
  ],
})
export class WatchlistPage implements OnInit, ViewWillEnter, OnDestroy {
  watchlistService: WatchlistService = inject(WatchlistService);
  loadingCtrl: LoadingController = inject(LoadingController);
  items: WatchlistItem[] = [];

  private sub = new Subscription();

  constructor() {
    addIcons({ trash });
  }

  ionViewWillEnter() {
    this.watchlistService.getWatchlist().subscribe();
  }

  ngOnInit() {
    this.sub = this.watchlistService.items.subscribe((items) => {
      this.items = items;
    });
  }

  async onRemove(id: string) {
    const loading = await this.loadingCtrl.create({ message: 'Removing...' });
    await loading.present();

    this.watchlistService.removeFromWatchlist(id).subscribe(async () => {
      await loading.dismiss();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
