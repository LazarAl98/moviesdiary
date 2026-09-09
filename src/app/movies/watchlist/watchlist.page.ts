import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonAvatar,
  IonButtons,
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
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  LoadingController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, filmOutline } from 'ionicons/icons';
import { WatchlistService } from '../watchlist';
import { WatchlistItem } from '../watchlist-item.model';

type WatchFilter = 'all' | 'watched' | 'toWatch';
type SortOption = 'title' | 'rating';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonList,
    IonItemSliding,
    IonItem,
    IonItemOptions,
    IonItemOption,
    IonAvatar,
    IonImg,
    IonLabel,
    IonIcon,
    RouterLink,
  ],
})
export class WatchlistPage implements OnInit, ViewWillEnter, OnDestroy {
  watchlistService: WatchlistService = inject(WatchlistService);
  loadingCtrl: LoadingController = inject(LoadingController);

  items: WatchlistItem[] = [];
  filter: WatchFilter = 'all';
  sortBy: SortOption = 'title';

  private sub = new Subscription();

  constructor() {
    addIcons({ trash, 'film-outline': filmOutline });
  }

  ionViewWillEnter() {
    this.watchlistService.getWatchlist().subscribe();
  }

  ngOnInit() {
    this.sub = this.watchlistService.items.subscribe((items) => {
      this.items = items;
    });
  }

  get displayedItems(): WatchlistItem[] {
    let filtered = this.items;
    if (this.filter === 'watched') filtered = filtered.filter((i) => i.watched);
    if (this.filter === 'toWatch')
      filtered = filtered.filter((i) => !i.watched);

    const sorted = [...filtered];
    if (this.sortBy === 'rating') {
      sorted.sort((a, b) => (b.myRating ?? -1) - (a.myRating ?? -1));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }

  onFilterChange(event: CustomEvent) {
    this.filter = event.detail.value as WatchFilter;
  }

  onSortChange(event: CustomEvent) {
    this.sortBy = event.detail.value as SortOption;
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
