import { Component, inject } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { film, bookmark, logOut, personCircle } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonMenuToggle,
    RouterLink,
  ],
})
export class AppComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  constructor() {
    addIcons({
      film,
      bookmark,
      'log-out': logOut,
      'person-circle': personCircle,
    });
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/log-in');
  }
}
