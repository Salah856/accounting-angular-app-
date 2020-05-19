import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminLoginService } from '../services/admin-login.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    private loginService: AdminLoginService,
    private router: Router
  ) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLoginStatus();
  }

  checkLoginStatus(): boolean {
    if (this.loginService.getUserToken()) {
      this.router.navigate(['/admin']);
      return false;
    } else {
      return true;
    }
  }
}
