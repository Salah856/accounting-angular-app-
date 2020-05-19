import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { AdminLoginService } from '../../services/admin-login.service';

@Component({
  selector: 'acc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends SmartComponent implements OnInit, OnDestroy {
  loginCreds: { username?: string, password?: string, rememberMe?: boolean };
  constructor(
    private toastService: ToastService,
    private router: Router,
    serverTranslatePipe: ServerTranslatePipe,
    translationService: TranslationService,
    private loginService: AdminLoginService
  ) {
    super(translationService, serverTranslatePipe);
  }

  init() {
    this.loginCreds = { rememberMe: true };
  }

  ngOnInit() {
    this.init();
  }


  onSubmit() {

    this.beforeLoadingData();
    this.loginService.userLogin(this.loginCreds.username, this.loginCreds.password)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          if (data.token) {
            this.loginService.setUserToken(data.token, 
              this.loginCreds.rememberMe, data.username, data.imageUrl);
            this.toastService.showSuccess(this.serverTranslatePipe.transform(data.message, this.lang));
            this.router.navigateByUrl('/admin/home');
          }
        },
        (err) => {
          this.afterLoadingData(err.error.message);
          this.loginCreds = {};
        }

      );

  }

  ngOnDestroy() {
    super.onDestroy();
  }
}
