import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import { StoreListResponse, StoreResponse, Store, StorePopulatedResponse, StorePopulated } from '../models/store.model';

@Injectable()
export class StoresService {
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
  getStores(filters: Filters): Observable<StoreListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<StoreListResponse>(`${apiUrl}/basicData/stores`, { params: httpParams });
  }

  getStore(id: string, populate?: boolean): Observable<StoreResponse| StorePopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<StoreResponse| StorePopulatedResponse>(`${apiUrl}/basicData/stores/${id}`, { params: httpParams });
  }

  addStore(store: Store): Observable<StoreResponse> {
    const storeBody = { ...store, active: store.active ? store.active : false };
    return this.http.post<StoreResponse>(`${apiUrl}/basicData/stores`, storeBody);
  }

  editStore(store: Store): Observable<StoreResponse> {
    const storeBody: Store = {
      name: store.name,
      email: store.email,
      website: store.website,
      phoneNumbers: store.phoneNumbers,
      createdAt: store.createdAt,
      address: store.address,
      fax: store.fax,
      active: store.active ? store.active : false
    };

    return this.http.put<StoreResponse>(`${apiUrl}/basicData/stores/${store._id}`, storeBody);
  }


  deleteStore(store: Store|StorePopulated): Observable<StoreResponse> {
    return this.http.delete<StoreResponse>(`${apiUrl}/basicData/stores/${store._id}`);
  }

}


