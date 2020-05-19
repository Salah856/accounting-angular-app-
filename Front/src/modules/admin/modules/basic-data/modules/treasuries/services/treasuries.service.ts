import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import {
  TreasuryListResponse,
  TreasuryResponse, Treasury, TreasuryOptionsResponse, TreasuryPopulatedResponse, TreasuryPopulated
} from '../models/treasury.model';

@Injectable()
export class TreasuriesService {
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
  getTreasuries(filters: Filters): Observable<TreasuryListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<TreasuryListResponse>(`${apiUrl}/basicData/treasuries`, { params: httpParams });
  }

  getTreasury(id: string, populate?: boolean): Observable<TreasuryResponse | TreasuryPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<TreasuryResponse | TreasuryPopulatedResponse>(`${apiUrl}/basicData/treasuries/${id}`, { params: httpParams });
  }

  addTreasury(treasury: Treasury): Observable<TreasuryResponse> {
    const treasuryBody = { ...treasury, active: treasury.active ? treasury.active : false };
    return this.http.post<TreasuryResponse>(`${apiUrl}/basicData/treasuries`, treasuryBody);
  }

  editTreasury(treasury: Treasury): Observable<TreasuryResponse> {
    const treasuryBody: Treasury = {
      name: treasury.name,
      createdAt: treasury.createdAt,
      currency: treasury.currency,
      currentBalance: treasury.currentBalance,
      openingBalance: treasury.openingBalance,
      active: treasury.active ? treasury.active : false
    };

    return this.http.put<TreasuryResponse>(`${apiUrl}/basicData/treasuries/${treasury._id}`, treasuryBody);
  }

  getOptions(): Observable<TreasuryOptionsResponse> {
    return this.http.get<TreasuryOptionsResponse>(`${apiUrl}/basicData/treasuries/options`);
  }

  deleteTreasury(treasury: Treasury | TreasuryPopulated): Observable<TreasuryResponse> {
    return this.http.delete<TreasuryResponse>(`${apiUrl}/basicData/treasuries/${treasury._id}`);
  }

}


