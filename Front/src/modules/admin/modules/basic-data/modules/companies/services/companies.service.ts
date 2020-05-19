import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { CompanyListResponse, Company, CompanyResponse } from '../models/company.model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class CompaniesService {
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

  getCompanies(filters: Filters): Observable<CompanyListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<CompanyListResponse>(`${apiUrl}/basicData/companies`, { params: httpParams });
  }

  getCompany(id: string): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(`${apiUrl}/basicData/companies/${id}`);
  }


  addCompany(company: Company): Observable<CompanyResponse> {
    const formData = new FormData();
    const companyBody = { ...company };
    Object.keys(companyBody).forEach((key) => {
      if (key === 'image') {
        formData.append(key, companyBody[key]);
      } else {
        formData.append(key, JSON.stringify(companyBody[key]));
      }
    });
    return this.http.post<CompanyResponse>(`${apiUrl}/basicData/companies`, formData);
  }

  editCompany(company: Company): Observable<CompanyResponse> {
    const formData = new FormData();
    const companyId = company._id;
    const newCompany = { ...company };
    delete newCompany._id;
    delete newCompany.signature;
    delete newCompany.__v;
    Object.keys(newCompany).forEach((key) => {
      if (key === 'image') {
        formData.append(key, newCompany[key]);
      } else {
        formData.append(key, JSON.stringify(newCompany[key]));
      }
    });
    return this.http.put<CompanyResponse>(`${apiUrl}/basicData/companies/${companyId}`, formData);
  }

  deleteCompany(company: Company): Observable<CompanyResponse> {
    return this.http.delete<CompanyResponse>(`${apiUrl}/basicData/companies/${company._id}`);
  }

}


