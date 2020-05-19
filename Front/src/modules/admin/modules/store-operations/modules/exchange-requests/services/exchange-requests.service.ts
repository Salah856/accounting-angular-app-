import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import {
  ExchangeRequestListResponse,
  ExchangeRequestResponse,
  ExchangeRequest,
  ExchangeRequestPopulatedResponse,
  ExchangeRequestPopulated,
  ExchangeRequestOptionsResponse
} from '../models/exchange-request.model';

@Injectable()
export class ExchangeRequestsService {
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
  getExchangeRequests(filters: Filters): Observable<ExchangeRequestListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<ExchangeRequestListResponse>(`${apiUrl}/storeOperations/exchangeRequests`, { params: httpParams });
  }

  getExchangeRequest(id: string, populate?: boolean): Observable<ExchangeRequestResponse | ExchangeRequestPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<ExchangeRequestResponse | ExchangeRequestPopulatedResponse>(
      `${apiUrl}/storeOperations/exchangeRequests/${id}`, { params: httpParams }
    );
  }

  addExchangeRequest(exchangeRequest: ExchangeRequest): Observable<ExchangeRequestResponse> {
    return this.http.post<ExchangeRequestResponse>(`${apiUrl}/storeOperations/exchangeRequests`, exchangeRequest);
  }

  editExchangeRequest(exchangeRequest: ExchangeRequest): Observable<ExchangeRequestResponse> {
    const exchangeRequestBody: ExchangeRequest = {
      date: exchangeRequest.date,
      notes: exchangeRequest.notes,
      store: exchangeRequest.store,
      storeSecretary: exchangeRequest.storeSecretary,
      exchangedItems: exchangeRequest.exchangedItems,
    };
    return this.http.put<ExchangeRequestResponse>(
      `${apiUrl}/storeOperations/exchangeRequests/${exchangeRequest._id}`, exchangeRequestBody
    );
  }

  getOptions(): Observable<ExchangeRequestOptionsResponse> {
    return this.http.get<ExchangeRequestOptionsResponse>(`${apiUrl}/storeOperations/exchangeRequests/options`);
  }

  convertToPermission(exchangeRequest: ExchangeRequest | ExchangeRequestPopulated): Observable<ExchangeRequestResponse> {
    return this.http
      .put<ExchangeRequestResponse>(`${apiUrl}/storeOperations/exchangeRequests/convertToPermission/${exchangeRequest._id}`, {});
  }

  deleteExchangeRequest(exchangeRequest: ExchangeRequest | ExchangeRequestPopulated): Observable<ExchangeRequestResponse> {
    return this.http.delete<ExchangeRequestResponse>(`${apiUrl}/storeOperations/exchangeRequests/${exchangeRequest._id}`);
  }

}


