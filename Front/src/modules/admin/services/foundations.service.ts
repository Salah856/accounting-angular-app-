import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import {
  FoundationListResponse,
  FoundationResponse,
  Foundation,
  FoundationPopulatedResponse,
  FoundationPopulated,
  FoundationFilters,
  FoundationListPopulatedResponse
} from '../models';

@Injectable()
export class FoundationsService {
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
  
  getFoundations(filters: FoundationFilters): Observable<FoundationListResponse|FoundationListPopulatedResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<FoundationListResponse|FoundationListPopulatedResponse>(`${apiUrl}/admin/foundations`, { params: httpParams });
  }

  getFoundation(id: string, populate?: boolean): Observable<FoundationResponse | FoundationPopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<FoundationResponse | FoundationPopulatedResponse>(`${apiUrl}/admin/foundations/${id}`, { params: httpParams });
  }

  addFoundation(foundation: Foundation): Observable<FoundationResponse> {
    const newFoundation = { ...foundation, active: foundation.active ? foundation.active : false };
    return this.http.post<FoundationResponse>(`${apiUrl}/admin/foundations`, newFoundation);
  }

  editFoundation(foundation: Foundation): Observable<FoundationResponse> {
    const foundationId = foundation._id;
    const newFoundation = {
      arName: foundation.arName,
      enName: foundation.enName,
      active: foundation.active ? foundation.active : false,
    };
    return this.http.put<FoundationResponse>(`${apiUrl}/admin/foundations/${foundationId}`, newFoundation);
  }


  deleteFoundation(foundation: Foundation | FoundationPopulated): Observable<FoundationResponse> {
    return this.http.delete<FoundationResponse>(`${apiUrl}/admin/foundations/${foundation._id}`);
  }

}


