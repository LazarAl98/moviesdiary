import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth';
import { UserProfile } from '../user-profile.model';

const EMPTY_PROFILE: UserProfile = { name: '', bio: '', avatarUrl: null };

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private _profile = new BehaviorSubject<UserProfile | null>(null);

  get profile() {
    return this._profile.asObservable();
  }

  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  //profil ulogovanog korisnika, RTDB vraca null ako jos ne postoji
  getProfile() {
    const userId = this.authService.getUserId();
    return this.http
      .get<UserProfile | null>(
        `${environment.firebaseRDBUrl}/users/${userId}.json?auth=${this.authService.getToken()}`,
      )
      .pipe(
        map((data) => data ?? EMPTY_PROFILE),
        tap((profile) => this._profile.next(profile)),
      );
  }
}
