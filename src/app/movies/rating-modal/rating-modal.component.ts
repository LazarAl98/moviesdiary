import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonRange,
  IonToggle,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, star, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonRange,
    IonToggle,
    FormsModule,
  ],
})
export class RatingModalComponent implements OnInit {
  modalCtrl: ModalController = inject(ModalController);

  @Input() title = 'Add to watchlist';
  @Input() myRating: number | null = null;
  @Input() watched = false;

  ngOnInit() {
    addIcons({ close, star, 'star-outline': starOutline });
  }
}
