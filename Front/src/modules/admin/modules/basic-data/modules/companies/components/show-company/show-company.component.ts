import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { CompaniesService } from '../../services';
import { Company } from '../../models/company.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { baseUrl } from 'src/api-config';

@Component({
  selector: 'acc-show-company',
  templateUrl: './show-company.component.html',
  styleUrls: ['./show-company.component.scss']
})
export class ShowCompanyComponent extends SmartComponent implements OnInit, OnDestroy {

  company: Company;
  companyId: string;
  rights: {[key: string]: boolean};

  get imageUrl() {
    return this.company.imageUrl ?
      `${baseUrl}${this.company.imageUrl}` : null;
  }
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private matDialog: MatDialog,
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private router: Router,
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
  loadData() {
    this.beforeLoadingData();
    this.companiesService.getCompany(this.companyId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.company = res.company;
          this.rights = res.rights;
          this.companiesService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteCompany() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_COMPANY',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteCompany();
        }
      }
    );
  }

  deleteCompany() {
    this.beforeLoadingData();
    this.companiesService.deleteCompany(this.company)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.router.navigate(['../'], { relativeTo: this.route });
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
