import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  IonButton,
  IonButtons,
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
import { personCircle } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { ProfileService } from './profile';
import { UserProfile } from '../user-profile.model';

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

  private sub = new Subscription();

  constructor() {
    addIcons({ 'person-circle': personCircle });
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
