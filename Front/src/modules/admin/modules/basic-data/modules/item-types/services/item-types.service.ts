import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import { ItemTypeListResponse, ItemTypeResponse, ItemType } from '../models/item-type.model';

@Injectable()
export class ItemTypesService {
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
  getItemTypes(filters: Filters): Observable<ItemTypeListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<ItemTypeListResponse>(`${apiUrl}/basicData/itemTypes`, { params: httpParams });
  }

  getItemType(id: string): Observable<ItemTypeResponse> {
    return this.http.get<ItemTypeResponse>(`${apiUrl}/basicData/itemTypes/${id}`);
  }

  addItemType(itemType: ItemType): Observable<ItemTypeResponse> {
    return this.http.post<ItemTypeResponse>(`${apiUrl}/basicData/itemTypes`, itemType);
  }

  editItemType(itemType: ItemType): Observable<ItemTypeResponse> {
    return this.http.put<ItemTypeResponse>(`${apiUrl}/basicData/itemTypes/${itemType._id}`, { name: itemType.name });
  }

  deleteItemType(itemType: ItemType): Observable<ItemTypeResponse> {
    return this.http.delete<ItemTypeResponse>(`${apiUrl}/basicData/itemTypes/${itemType._id}`);
  }

}


