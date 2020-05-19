import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import {
  ExchangePermissionListResponse,
  ExchangePermissionResponse,
  ExchangePermission,
  ExchangePermissionPopulatedResponse,
  ExchangePermissionPopulated,
  ExchangePermissionOptionsResponse
} from '../models/exchange-permission.model';

@Injectable()
export class ExchangePermissionsService {
  private rights$ = new ReplaySubject<{ [key: string]: boolean }>(1);

  constructor(
    private http: HttpClient
  ) {
  }
  setAppRights(rights: { [key: string]: boolean }) {
    this.rights$.next(rights);
  }

  getAppRights() {
    return this.rights$.asObservable();
  }
  getExchangePermissions(filters: Filters): Observable<ExchangePermissionListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<ExchangePermissionListResponse>(`${apiUrl}/storeOperations/exchangePermissions`, { params: httpParams });
  }

  getExchangePermission(id: string, populate?: boolean): Observable<ExchangePermissionResponse | ExchangePermissionPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<ExchangePermissionResponse | ExchangePermissionPopulatedResponse>(
      `${apiUrl}/storeOperations/exchangePermissions/${id}`, { params: httpParams }
    );
  }

  addExchangePermission(exchangePermission: ExchangePermission): Observable<ExchangePermissionResponse> {
    return this.http.post<ExchangePermissionResponse>(`${apiUrl}/storeOperations/exchangePermissions`, exchangePermission);
  }

  editExchangePermission(exchangePermission: ExchangePermission): Observable<ExchangePermissionResponse> {
    const exchangePermissionBody: ExchangePermission = {
      date: exchangePermission.date,
      notes: exchangePermission.notes,
      store: exchangePermission.store,
      storeSecretary: exchangePermission.storeSecretary,
      exchangedItems: exchangePermission.exchangedItems,
    };
    return this.http.put<ExchangePermissionResponse>(
      `${apiUrl}/storeOperations/exchangePermissions/${exchangePermission._id}`, exchangePermissionBody
    );
  }

  getOptions(): Observable<ExchangePermissionOptionsResponse> {
    return this.http.get<ExchangePermissionOptionsResponse>(`${apiUrl}/storeOperations/exchangePermissions/options`);
  }

  deleteExchangePermission(exchangePermission: ExchangePermission | ExchangePermissionPopulated): Observable<ExchangePermissionResponse> {
    return this.http.delete<ExchangePermissionResponse>(`${apiUrl}/storeOperations/exchangePermissions/${exchangePermission._id}`);
  }

}


