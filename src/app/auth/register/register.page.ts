import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonRow,
  IonTitle,
  IonToolbar,
  LoadingController,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonInput,
    IonButton,
    RouterLink,
  ],
})
export class RegisterPage {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  loadingCtrl: LoadingController = inject(LoadingController);
  alertCtrl: AlertController = inject(AlertController);

  registerForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(7),
    ]),
  });

  async onRegister() {
    if (this.registerForm.invalid) return;

    const loadingEl = await this.loadingCtrl.create({
      message: 'Registracija u toku...',
    });
    await loadingEl.present();

    this.authService.register(this.registerForm.value as any).subscribe({
      next: () => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/movies/tabs/discover', {
          replaceUrl: true,
        });
      },
      error: async (err) => {
        loadingEl.dismiss();
        console.error(err);

        const code = err.error?.error?.message;
        let message = 'Pokušaj ponovo.';
        if (code === 'EMAIL_EXISTS') {
          message = 'Ovaj email je već registrovan.';
        } else if (code === 'INVALID_EMAIL') {
          message = 'Email adresa nije validna.';
        } else if (code) {
          message = `Firebase greška: ${code}`;
        }

        const alert = await this.alertCtrl.create({
          header: 'Registracija nije uspela',
          message,
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }
}
