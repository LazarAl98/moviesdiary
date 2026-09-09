import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  AlertController,
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
  alertCtrl: AlertController = inject(AlertController);

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
      error: async (err) => {
        loadingEl.dismiss();
        console.error(err);

        const code = err.error?.error?.message;
        let message = 'Neispravan email ili lozinka.';
        if (code === 'OPERATION_NOT_ALLOWED') {
          message = 'Email/password prijava nije uključena';
        } else if (
          code &&
          code !== 'INVALID_LOGIN_CREDENTIALS' &&
          code !== 'EMAIL_NOT_FOUND' &&
          code !== 'INVALID_PASSWORD'
        ) {
          message = `Firebase greška: ${code}`;
        }

        const alert = await this.alertCtrl.create({
          header: 'Prijava nije uspela',
          message,
          buttons: ['OK'],
        });
        await alert.present();
        logInForm.reset();
      },
    });
  }
}
