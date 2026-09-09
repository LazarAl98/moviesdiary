import { Routes } from '@angular/router';
import { MoviesPage } from './movies.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: MoviesPage,
    children: [
      {
        path: 'discover',
        loadChildren: () =>
          import('./discover/discover.routes').then((m) => m.routes),
      },
      {
        path: 'watchlist',
        loadComponent: () =>
          import('./watchlist/watchlist.page').then((m) => m.WatchlistPage),
      },
      {
        path: '',
        redirectTo: '/movies/tabs/discover',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/movies/tabs/discover',
    pathMatch: 'full',
  },
];
