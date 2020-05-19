import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiUrl } from 'src/api-config';
import { Observable } from 'rxjs';
import {
  AppListResponse,
  AppResponse,
  App,
  AppPopulatedResponse,
  AppPopulated,
  AppFilters
} from '../models';

@Injectable()
export class AppsService {

  constructor(
    private http: HttpClient
  ) {
  }

  getApps(filters: AppFilters): Observable<AppListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<AppListResponse>(`${apiUrl}/admin/apps`, { params: httpParams });
  }

  getApp(id: string, populate?: boolean): Observable<AppResponse | AppPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<AppResponse | AppPopulatedResponse>(`${apiUrl}/admin/apps/${id}`, { params: httpParams });
  }

  addApp(app: App): Observable<AppResponse> {
    return this.http.post<AppResponse>(`${apiUrl}/admin/apps`, app);
  }

  editApp(app: App): Observable<AppResponse> {
    const appId = app._id;
    const newApp = {
      arName: app.arName,
      enName: app.enName,
    };
    return this.http.put<AppResponse>(`${apiUrl}/admin/apps/${appId}`, newApp);
  }


  deleteApp(app: App | AppPopulated): Observable<AppResponse> {
    return this.http.delete<AppResponse>(`${apiUrl}/admin/apps/${app._id}`);
  }

}


