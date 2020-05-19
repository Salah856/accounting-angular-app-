import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AdminLoginService } from '../services/admin-login.service';

@Injectable()
export class HomeGuard implements CanActivate  {
  constructor(
    private loginService: AdminLoginService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      return this.checkLoginStatus();
  }

  checkLoginStatus(): boolean {
    if (this.loginService.getUserToken()) {
        return true;
    } else {
        this.router.navigate(['/admin/login']);
        return false;
    }
  }
}
