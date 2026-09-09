import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
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

  //azuriranje ime i bio, avatar ostaje kakav je bio
  updateProfile(name: string, bio: string) {
    return this.saveProfile((current) => ({ ...current, name, bio }));
  }

  private saveProfile(merge: (current: UserProfile) => UserProfile) {
    const userId = this.authService.getUserId();
    return this.profile.pipe(
      take(1),
      switchMap((current) => {
        const updated = merge(current ?? EMPTY_PROFILE);
        return this.http
          .put<UserProfile>(
            `${environment.firebaseRDBUrl}/users/${userId}.json?auth=${this.authService.getToken()}`,
            updated,
          )
          .pipe(tap(() => this._profile.next(updated)));
      }),
    );
  }
}
