import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import {
  AddingRequestListResponse,
  AddingRequestResponse,
  AddingRequest,
  AddingRequestPopulatedResponse,
  AddingRequestPopulated,
  AddingRequestOptionsResponse
} from '../models/adding-request.model';

@Injectable()
export class AddingRequestsService {
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
  getAddingRequests(filters: Filters): Observable<AddingRequestListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<AddingRequestListResponse>(`${apiUrl}/storeOperations/addingRequests`, { params: httpParams });
  }

  getAddingRequest(id: string, populate?: boolean): Observable<AddingRequestResponse | AddingRequestPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<AddingRequestResponse | AddingRequestPopulatedResponse>(
      `${apiUrl}/storeOperations/addingRequests/${id}`, { params: httpParams }
    );
  }

  addAddingRequest(addingRequest: AddingRequest): Observable<AddingRequestResponse> {
    return this.http.post<AddingRequestResponse>(`${apiUrl}/storeOperations/addingRequests`, addingRequest);
  }

  editAddingRequest(addingRequest: AddingRequest): Observable<AddingRequestResponse> {
    const addingRequestBody: AddingRequest = {
      date: addingRequest.date,
      notes: addingRequest.notes,
      store: addingRequest.store,
      storeSecretary: addingRequest.storeSecretary,
      addedItems: addingRequest.addedItems,
    };
    return this.http.put<AddingRequestResponse>(
      `${apiUrl}/storeOperations/addingRequests/${addingRequest._id}`, addingRequestBody
    );
  }

  getOptions(): Observable<AddingRequestOptionsResponse> {
    return this.http.get<AddingRequestOptionsResponse>(`${apiUrl}/storeOperations/addingRequests/options`);
  }

  convertToPermission(addingRequest: AddingRequest | AddingRequestPopulated): Observable<AddingRequestResponse> {
    return this.http.put<AddingRequestResponse>(`${apiUrl}/storeOperations/addingRequests/convertToPermission/${addingRequest._id}`, {});
  }

  deleteAddingRequest(addingRequest: AddingRequest | AddingRequestPopulated): Observable<AddingRequestResponse> {
    return this.http.delete<AddingRequestResponse>(`${apiUrl}/storeOperations/addingRequests/${addingRequest._id}`);
  }

}


