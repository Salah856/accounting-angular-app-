import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Company } from '../../models/company.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CompaniesService } from '../../services';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';

@Component({
  selector: 'acc-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent extends SmartComponent implements OnInit, OnDestroy {
  company: Company;
  companyId: string;
  get companyImageLabel() {
    return this.company.imageUrl ?
      this.company.imageUrl.split('/')[this.company.imageUrl.split('/').length - 1]
      : 'NO_SELECTED_FILE';
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companiesService: CompaniesService,
    private toastService: ToastService,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.company = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.companyId = snapshot.get('id');
          if (this.companyId) {
            this.loadData();
          }
        }
      );
  }
  onFileChange(file: File) {
    this.company.image = file;
  }
  loadData() {
    this.beforeLoadingData();
    this.companiesService.getCompany(this.companyId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.company = res.company;
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.companiesService.addCompany(this.company);
    if (this.companyId) {
      request = this.companiesService.editCompany(this.company);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.companyId) {
          this.router.navigate(['../../'], { relativeTo: this.route });
        } else {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      (err) => {
        this.afterLoadingData(err.error.message);
      }
    );
  }

  ngOnDestroy() {
    this.onDestroy();
  }

}
