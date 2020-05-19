import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import {
  AddingPermissionListResponse,
  AddingPermissionResponse,
  AddingPermission,
  AddingPermissionPopulatedResponse,
  AddingPermissionPopulated,
  AddingPermissionOptionsResponse
} from '../models/adding-permission.model';

@Injectable()
export class AddingPermissionsService {
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
  getAddingPermissions(filters: Filters): Observable<AddingPermissionListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<AddingPermissionListResponse>(`${apiUrl}/storeOperations/addingPermissions`, { params: httpParams });
  }

  getAddingPermission(id: string, populate?: boolean): Observable<AddingPermissionResponse | AddingPermissionPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<AddingPermissionResponse | AddingPermissionPopulatedResponse>(
      `${apiUrl}/storeOperations/addingPermissions/${id}`, { params: httpParams }
    );
  }

  addAddingPermission(addingPermission: AddingPermission): Observable<AddingPermissionResponse> {
    return this.http.post<AddingPermissionResponse>(`${apiUrl}/storeOperations/addingPermissions`, addingPermission);
  }

  editAddingPermission(addingPermission: AddingPermission): Observable<AddingPermissionResponse> {
    const addingPermissionBody: AddingPermission = {
      date: addingPermission.date,
      notes: addingPermission.notes,
      store: addingPermission.store,
      storeSecretary: addingPermission.storeSecretary,
      addedItems: addingPermission.addedItems,
    };
    return this.http.put<AddingPermissionResponse>(
      `${apiUrl}/storeOperations/addingPermissions/${addingPermission._id}`, addingPermissionBody
    );
  }

  getOptions(): Observable<AddingPermissionOptionsResponse> {
    return this.http.get<AddingPermissionOptionsResponse>(`${apiUrl}/storeOperations/addingPermissions/options`);
  }

  deleteAddingPermission(addingPermission: AddingPermission | AddingPermissionPopulated): Observable<AddingPermissionResponse> {
    return this.http.delete<AddingPermissionResponse>(`${apiUrl}/storeOperations/addingPermissions/${addingPermission._id}`);
  }

}


