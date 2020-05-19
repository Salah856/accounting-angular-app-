import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { CurrencyListResponse, Currency, CurrencyResponse } from '../models/currency.model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class CurrenciesService {
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

  getCurrencies(filters: Filters): Observable<CurrencyListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<CurrencyListResponse>(`${apiUrl}/basicData/currencies`, { params: httpParams });
  }

  getCurrency(id: string): Observable<CurrencyResponse> {
    return this.http.get<CurrencyResponse>(`${apiUrl}/basicData/currencies/${id}`);
  }

  addCurrency(currency: Currency): Observable<CurrencyResponse> {
    return this.http.post<CurrencyResponse>(`${apiUrl}/basicData/currencies`, currency);
  }

  editCurrency(currency: Currency): Observable<CurrencyResponse> {
    return this.http.put<CurrencyResponse>(`${apiUrl}/basicData/currencies/${currency._id}`, {
      name: currency.name,
      symbol: currency.symbol,
    });
  }

  deleteCurrency(currency: Currency): Observable<CurrencyResponse> {
    return this.http.delete<CurrencyResponse>(`${apiUrl}/basicData/currencies/${currency._id}`);
  }

}


