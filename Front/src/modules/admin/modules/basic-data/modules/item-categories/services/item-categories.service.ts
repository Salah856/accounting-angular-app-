import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import { ItemCategoryListResponse, ItemCategoryResponse, ItemCategory } from '../models/item-category.model';

@Injectable()
export class ItemCategoriesService {
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

  getItemCategories(filters: Filters): Observable<ItemCategoryListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<ItemCategoryListResponse>(`${apiUrl}/basicData/itemCategories`, { params: httpParams });
  }

  getItemCategory(id: string): Observable<ItemCategoryResponse> {
    return this.http.get<ItemCategoryResponse>(`${apiUrl}/basicData/itemCategories/${id}`);
  }

  addItemCategory(itemCategory: ItemCategory): Observable<ItemCategoryResponse> {
    return this.http.post<ItemCategoryResponse>(`${apiUrl}/basicData/itemCategories`, itemCategory);
  }

  editItemCategory(itemCategory: ItemCategory): Observable<ItemCategoryResponse> {
    return this.http.put<ItemCategoryResponse>(`${apiUrl}/basicData/itemCategories/${itemCategory._id}`, { name: itemCategory.name });
  }

  deleteItemCategory(itemCategory: ItemCategory): Observable<ItemCategoryResponse> {
    return this.http.delete<ItemCategoryResponse>(`${apiUrl}/basicData/itemCategories/${itemCategory._id}`);
  }

}


