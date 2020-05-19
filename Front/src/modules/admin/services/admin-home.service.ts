import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiUrl } from 'src/api-config';
import { Observable } from 'rxjs';
import { AppListResponse } from '../models/app.model';


@Injectable()
export class AdminHomeService {
  private urls = {
    apps: `${apiUrl}/admin/apps`
  };

  constructor(
    private httpClient: HttpClient
  ) {

  }

  getUserApps(): Observable<AppListResponse> {
    const httpParams = new HttpParams()
                            .set('all', '1');
    return this.httpClient.get<AppListResponse>(this.urls.apps, { params: httpParams });
  }
}


