import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonAvatar,
  IonSpinner,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonMenuButton,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle, camera } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { ProfileService } from './profile';
import { UserProfile } from '../user-profile.model';
const MAX_AVATAR_BYTES = 500 * 1024;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonAvatar,
    IonSpinner,
    IonMenuButton,
    IonContent,
    IonIcon,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    FormsModule,
  ],
})
export class ProfilePage implements OnInit, ViewWillEnter, OnDestroy {
  profileService: ProfileService = inject(ProfileService);
  toastCtrl: ToastController = inject(ToastController);

  profile: UserProfile | null = null;
  isUploading = false;

  private sub = new Subscription();

  constructor() {
    addIcons({ 'person-circle': personCircle, camera });
  }

  ionViewWillEnter() {
    this.profileService.getProfile().subscribe();
  }

  ngOnInit() {
    this.sub = this.profileService.profile.subscribe((profile) => {
      this.profile = profile;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  //slika se cuva kao data URL (base64) direktno u RTDB
  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_BYTES) {
      const toast = await this.toastCtrl.create({
        message: 'Slika je prevelika, izaberi jednu do 500 KB.',
        duration: 2500,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    this.isUploading = true;
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.profileService.updateAvatar(dataUrl).subscribe(() => {
        this.isUploading = false;
      });
    };

    reader.onerror = async () => {
      this.isUploading = false;
      const toast = await this.toastCtrl.create({
        message: 'Učitavanje slike nije uspelo.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    };

    reader.readAsDataURL(file);
  }

  onSave(form: NgForm) {
    if (form.invalid) return;

    this.profileService
      .updateProfile(form.value.name, form.value.bio ?? '')
      .subscribe(async () => {
        const toast = await this.toastCtrl.create({
          message: 'Profil sačuvan.',
          duration: 1500,
          color: 'success',
        });
        await toast.present();
      });
  }
}
