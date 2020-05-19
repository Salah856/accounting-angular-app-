import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import {
  PaymentClauseListResponse,
  PaymentClauseResponse,
  PaymentClause,
  PaymentClausePopulatedResponse,
  PaymentClausePopulated
} from '../models/payment-clause.model';

@Injectable()
export class PaymentClausesService {
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
  getPaymentClauses(filters: Filters): Observable<PaymentClauseListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<PaymentClauseListResponse>(`${apiUrl}/basicData/paymentClauses`, { params: httpParams });
  }

  getPaymentClause(id: string, populate?: boolean): Observable<PaymentClauseResponse | PaymentClausePopulatedResponse> {
    let httpParams = new HttpParams();
    if (populate) {
      httpParams = httpParams.set('populate', '1');
    }
    return this.http.get<PaymentClauseResponse | PaymentClausePopulatedResponse>
      (`${apiUrl}/basicData/paymentClauses/${id}`, { params: httpParams });
  }

  addPaymentClause(paymentClause: PaymentClause): Observable<PaymentClauseResponse> {
    paymentClause = { ...paymentClause, constant: paymentClause.constant ? paymentClause.constant : false };
    return this.http.post<PaymentClauseResponse>(`${apiUrl}/basicData/paymentClauses`, paymentClause);
  }

  editPaymentClause(paymentClause: PaymentClause): Observable<PaymentClauseResponse> {
    const paymentClauseBody = { name: paymentClause.name, constant: paymentClause.constant ? paymentClause.constant : false };
    return this.http.put<PaymentClauseResponse>(`${apiUrl}/basicData/paymentClauses/${paymentClause._id}`, paymentClauseBody);
  }

  deletePaymentClause(paymentClause: PaymentClause | PaymentClausePopulated): Observable<PaymentClauseResponse> {
    return this.http.delete<PaymentClauseResponse>(`${apiUrl}/basicData/paymentClauses/${paymentClause._id}`);
  }

}


