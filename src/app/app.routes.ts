import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/movies/tabs/discover',
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
    path: 'profile',
    loadComponent: () => import('./profile/profile/profile.page').then( m => m.ProfilePage)
  },
];
