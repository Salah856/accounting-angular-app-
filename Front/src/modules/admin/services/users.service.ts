import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import {
  UserListResponse,
  UserResponse, User,
  UserPopulatedResponse,
  UserPopulated,
  UserRightsOptionsResponse,
  UserAppsListResponse
} from '../modules/system-admin/modules/users/models/user.model';

@Injectable()
export class UsersService {
  private rights$ = new ReplaySubject<{[key: string]: boolean}>(1);

  constructor(
    private http: HttpClient
  ) {
  }
  setAppRights(rights: {[key: string]: boolean}) {
    this.rights$.next(rights);
  }

  getAppRights() {
    return this.rights$.asObservable();
  }
  getUsers(filters: Filters): Observable<UserListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<UserListResponse>(`${apiUrl}/admin/users`, { params: httpParams });
  }

  getUser(id: string, populate?: boolean): Observable<UserResponse | UserPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<UserResponse | UserPopulatedResponse>(`${apiUrl}/admin/users/${id}`, { params: httpParams });
  }

  getUserRights(id: string, populate?: boolean): Observable<UserResponse | UserPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<UserResponse | UserPopulatedResponse>(`${apiUrl}/admin/users/rights/${id}`, { params: httpParams });
  }

  getUserApps(): Observable<UserAppsListResponse> {
    return this.http.get<UserAppsListResponse>(`${apiUrl}/admin/users/apps/me`);
  }

  editUserRights(user: User): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${apiUrl}/admin/users/rights/${user._id}`, { userRights: user.userRights });
  }

  addUser(user: User): Observable<UserResponse> {
    const formData = new FormData();
    const userBody = { ...user, active: user.active ? user.active : false };
    Object.keys(userBody).forEach((key) => {
      if (key === 'active') {
        formData.append(key, userBody[key] ? JSON.stringify(userBody[key]) : JSON.stringify(false));
      } else if (key === 'image') {
        formData.append(key, userBody[key]);
      } else {
        formData.append(key, JSON.stringify(userBody[key]));
      }
    });
    return this.http.post<UserResponse>(`${apiUrl}/admin/users`, formData);
  }

  editUser(user: User): Observable<UserResponse> {
    const formData = new FormData();
    const userId = user._id;
    const newUser = { ...user };
    delete newUser._id;
    delete newUser.signature;
    delete newUser.__v;
    Object.keys(newUser).forEach((key) => {
      if (key === 'active') {
        formData.append(key, newUser[key] ? JSON.stringify(newUser[key]) : JSON.stringify(false));
      } else if (key === 'image') {
        formData.append(key, newUser[key]);
      } else {
        formData.append(key, JSON.stringify(newUser[key]));
      }
    });
    return this.http.put<UserResponse>(`${apiUrl}/admin/users/${userId}`, formData);
  }


  deleteUser(user: User | UserPopulated): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${apiUrl}/admin/users/${user._id}`);
  }

  deleteUserRights(user: User | UserPopulated): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${apiUrl}/admin/users/rights/${user._id}`);
  }

  getRightOptions(): Observable<UserRightsOptionsResponse> {
    return this.http.get<UserRightsOptionsResponse>(`${apiUrl}/admin/users/rights/options`);
  }

}


