import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
  LoadingController,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonInput,
    IonButton,
    IonRow,
    IonCol,
    IonGrid,
    IonInputPasswordToggle,
    IonLabel,
    RouterLink,
  ],
})
export class LogInPage {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  loadingCtrl: LoadingController = inject(LoadingController);

  async onLogIn(logInForm: NgForm) {
    if (!logInForm.valid) return;

    const loadingEl = await this.loadingCtrl.create({
      message: 'Prijava u toku...',
    });
    await loadingEl.present();

    this.authService.logIn(logInForm.value).subscribe({
      next: () => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/movies/tabs/discover');
      },
      error: (err) => {
        loadingEl.dismiss();
        console.error(err);
      },
    });
  }
}
