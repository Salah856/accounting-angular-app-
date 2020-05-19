import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/api-config';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/modules/shared/services';
import { SessionStorageService } from 'src/modules/shared/services/session-storage.service';
import { LoginResponse } from 'src/modules/shared/models/login-response.model';


@Injectable()
export class AdminLoginService {
  private userDataKey = 'userData';
  private userData: { token: string; remember: boolean; username: string, imageUrl: string };
  private urls = {
    login: `${apiUrl}/admin/users/login`
  };

  constructor(
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private httpClient: HttpClient
  ) {
    this.loadUserData();
  }

  loadUserData() {
    const localStorageData = this.localStorage.get(this.userDataKey, true);
    const sessionStorageData = this.sessionStorage.get(this.userDataKey, true);
    this.userData = localStorageData || sessionStorageData;
  }

  getUserToken(): string {
    return this.userData ? this.userData.token : null;
  }
  getUserRemember(): boolean {
    return this.userData ? this.userData.remember : false;
  }

  getUsername(): string {
    return this.userData ? this.userData.username : null;
  }

  getImageUrl(): string {
    return this.userData ? this.userData.imageUrl : null;
  }
  setUserToken(token: string, remember: boolean, username: string, imageUrl: string): void {
    this.userData = { token, remember, username, imageUrl };
    if (remember) {
      this.localStorage.set(this.userDataKey, this.userData, true);
    } else {
      this.sessionStorage.set(this.userDataKey, this.userData, true);
    }
  }

  userLogin(username: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.urls.login, { username, password });
  }

  logout(): void {
    this.localStorage.remove(this.userDataKey);
    this.sessionStorage.remove(this.userDataKey);
    this.userData = null;
  }
}


