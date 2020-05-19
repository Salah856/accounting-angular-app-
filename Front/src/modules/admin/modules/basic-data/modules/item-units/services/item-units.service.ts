import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import { ItemUnitListResponse, ItemUnitResponse, ItemUnit } from '../models/item-unit.model';

@Injectable()
export class ItemUnitsService {
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
  getItemUnits(filters: Filters): Observable<ItemUnitListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<ItemUnitListResponse>(`${apiUrl}/basicData/itemUnits`, { params: httpParams });
  }

  getItemUnit(id: string): Observable<ItemUnitResponse> {
    return this.http.get<ItemUnitResponse>(`${apiUrl}/basicData/itemUnits/${id}`);
  }

  addItemUnit(itemUnit: ItemUnit): Observable<ItemUnitResponse> {
    return this.http.post<ItemUnitResponse>(`${apiUrl}/basicData/itemUnits`, itemUnit);
  }

  editItemUnit(itemUnit: ItemUnit): Observable<ItemUnitResponse> {
    return this.http.put<ItemUnitResponse>(`${apiUrl}/basicData/itemUnits/${itemUnit._id}`, {
      name: itemUnit.name,
      numberOfItems: itemUnit.numberOfItems
    });
  }

  deleteItemUnit(itemUnit: ItemUnit): Observable<ItemUnitResponse> {
    return this.http.delete<ItemUnitResponse>(`${apiUrl}/basicData/itemUnits/${itemUnit._id}`);
  }

}


