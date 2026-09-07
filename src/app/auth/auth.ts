import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './user.model';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

export interface UserData {
  name?: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user?: User | null;

  private _isUserAuthenticated = false;

  http: HttpClient = inject(HttpClient);

  constructor() {}

  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  register(user: UserData) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        { email: user.email, password: user.password, returnSecureToken: true },
      )
      .pipe(tap((userData) => this.setUser(userData)));
  }

  logOut() {
    this._isUserAuthenticated = false;
    this.user = null;
  }

  getToken() {
    if (this.user) return this.user.token;
    else return null;
  }

  getUserId() {
    if (this.user) return this.user.id;
    else return null;
  }

  private setUser(userData: AuthResponseData) {
    this._isUserAuthenticated = true;
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000,
    );
    this.user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime,
    );
  }
}
