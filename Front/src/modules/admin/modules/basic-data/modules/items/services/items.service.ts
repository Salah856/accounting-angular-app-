import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import { ItemListResponse, ItemResponse, Item, ItemOptionsResponse, ItemPopulatedResponse, ItemPopulated } from '../models/item.model';

@Injectable()
export class ItemsService {
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
  getItems(filters: Filters): Observable<ItemListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<ItemListResponse>(`${apiUrl}/basicData/items`, { params: httpParams });
  }

  getItem(id: string, populate?: boolean): Observable<ItemResponse | ItemPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<ItemResponse | ItemPopulatedResponse>(`${apiUrl}/basicData/items/${id}`, { params: httpParams });
  }

  addItem(item: Item): Observable<ItemResponse> {
    const itemBody = { ...item, active: item.active ? item.active : false };
    return this.http.post<ItemResponse>(`${apiUrl}/basicData/items`, itemBody);
  }

  editItem(item: Item): Observable<ItemResponse> {
    const itemBody: Item = {
      name: item.name,
      currency: item.currency,
      barcode: item.barcode,
      company: item.company,
      category: item.category,
      defectivePrice: item.defectivePrice,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      type: item.type,
      unit: item.unit,
      wholesalePrice: item.wholesalePrice,
      active: item.active ? item.active : false
    };
    return this.http.put<ItemResponse>(`${apiUrl}/basicData/items/${item._id}`, itemBody);
  }

  getOptions(): Observable<ItemOptionsResponse> {
    return this.http.get<ItemOptionsResponse>(`${apiUrl}/basicData/items/options`);
  }

  deleteItem(item: Item|ItemPopulated): Observable<ItemResponse> {
    return this.http.delete<ItemResponse>(`${apiUrl}/basicData/items/${item._id}`);
  }

}


