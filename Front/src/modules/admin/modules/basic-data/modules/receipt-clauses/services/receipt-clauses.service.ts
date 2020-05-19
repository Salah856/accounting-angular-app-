import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import {
  ReceiptClauseListResponse,
  ReceiptClauseResponse,
  ReceiptClause,
  ReceiptClausePopulatedResponse,
  ReceiptClausePopulated
} from '../models/receipt-clause.model';

@Injectable()
export class ReceiptClausesService {
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

  getReceiptClauses(filters: Filters): Observable<ReceiptClauseListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<ReceiptClauseListResponse>(`${apiUrl}/basicData/receiptClauses`, { params: httpParams });
  }

  getReceiptClause(id: string, populate?: boolean): Observable<ReceiptClauseResponse | ReceiptClausePopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<ReceiptClauseResponse | ReceiptClausePopulatedResponse>
      (`${apiUrl}/basicData/receiptClauses/${id}`, { params: httpParams });
  }

  addReceiptClause(receiptClause: ReceiptClause): Observable<ReceiptClauseResponse> {
    receiptClause = { ...receiptClause, constant: receiptClause.constant ? receiptClause.constant : false };
    return this.http.post<ReceiptClauseResponse>(`${apiUrl}/basicData/receiptClauses`, receiptClause);
  }

  editReceiptClause(receiptClause: ReceiptClause): Observable<ReceiptClauseResponse> {
    const receiptClauseBody = { name: receiptClause.name, constant: receiptClause.constant ? receiptClause.constant : false };
    return this.http.put<ReceiptClauseResponse>(`${apiUrl}/basicData/receiptClauses/${receiptClause._id}`, receiptClauseBody);
  }

  deleteReceiptClause(receiptClause: ReceiptClause | ReceiptClausePopulated): Observable<ReceiptClauseResponse> {
    return this.http.delete<ReceiptClauseResponse>(`${apiUrl}/basicData/receiptClauses/${receiptClause._id}`);
  }

}


