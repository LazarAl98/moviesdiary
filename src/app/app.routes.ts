import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/log-in',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'log-in',
    loadComponent: () =>
      import('./auth/log-in/log-in.page').then((m) => m.LogInPage),
  },
  {
    path: 'discover',
    loadComponent: () =>
      import('./movies/discover/discover.page').then((m) => m.DiscoverPage),
  },
  {
    path: 'movies',
    loadComponent: () => import('./movies/movies/movies.page').then( m => m.MoviesPage)
  },
];
