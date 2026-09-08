import { Routes } from '@angular/router';
import { DiscoverPage } from './discover.page';

export const routes: Routes = [
  {
    path: '',
    component: DiscoverPage,
  },
  {
    path: ':movieId',
    loadComponent: () =>
      import('./movie-details/movie-details.page').then(
        (m) => m.MovieDetailsPage,
      ),
  },
];
