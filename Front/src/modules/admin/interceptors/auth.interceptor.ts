import { tap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { AdminLoginService } from '../services/admin-login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private adminLoginService: AdminLoginService,
    private router: Router,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.adminLoginService.getUserToken();
    req = req.clone({
      setHeaders: {
        'Authorization': authToken ? authToken : '',
      },
    });
    const adminRemember = this.adminLoginService.getUserRemember();
    const username = this.adminLoginService.getUsername();
    const imageUrl = this.adminLoginService.getImageUrl();
    const oldToken = this.adminLoginService.getUserToken();
    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            const token = event.headers.get('authorization') || oldToken;
            this.adminLoginService.setUserToken(token, adminRemember, username, imageUrl);
          }
        },
      ),
      catchError(
        (err: HttpErrorResponse) => {
          const token = err.headers.get('authorization') || oldToken;
          this.adminLoginService.setUserToken(token, adminRemember, username, imageUrl);
          if (err.status === 401) {
            this.adminLoginService.logout();
            this.router.navigate(['/admin/login']);
            return EMPTY;
          } else if (err.status === 404) {
            this.router.navigate(['/admin/home']);
            return EMPTY;
          } else {
            return throwError(err);
          }
        }
      )
    );
  }
}
