import { Component, OnInit, OnDestroy } from '@angular/core';
import { Company } from '../../models/company.model';
import { CompaniesService } from '../../services';
import { TableColumn } from 'src/modules/shared/components/responsive-table/models/table-column.model';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { PagedComponent } from 'src/modules/shared/base-components/paged.component';
import { PageEvent, MatDialog, Sort } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { RowClickEvent } from 'src/modules/shared/components/responsive-table/models/row-click-event.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'acc-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.scss']
})
export class ListCompanyComponent extends PagedComponent implements OnInit, OnDestroy {
  companies: Company[];
  rights: {[key: string]: boolean};
  columns: TableColumn[] = [
    { name: '_id', label: 'ID', sortable: false, filter: true },
    { name: 'name', label: 'COMPANY_NAME', sortable: true, filter: true },
    { name: 'actions', label: 'ACTIONS', sortable: false, filter: false, customTemplate: true, hideLabelInMobile: true },
  ];
  constructor(
    private companiesService: CompaniesService,
    private toastService: ToastService,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
    this.loadData();
  }

  init() {
    this.companies = [];
  }

  loadData() {
    this.beforeLoadingData();
    this.companiesService.getCompanies({
      limit: this.limit,
      skip: this.skip,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    })
      .subscribe(
        data => {
          this.companies = data.companies;
          this.rights = data.rights;
          this.companiesService.setAppRights(data.rights);
          this.totalCount = data.count;
          this.afterLoadingData();
        },
        err => {
          this.afterLoadingData(err.error.message);
        }
      );

  }

  confirmDeleteCompany(company: Company, index: number) {
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
          this.deleteCompany(company, index);
        }
      }
    );
  }
  deleteCompany(company: Company, index: number) {
    this.beforeLoadingData();
    this.companiesService.deleteCompany(company)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.companies = [
            ...this.companies.slice(0, index),
            ...this.companies.slice(index + 1)
          ];
          this.toastService
            .showSuccess(this.serverTranslatePipe.transform(data.message, this.lang));
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  onRowClick(event: RowClickEvent) {
    this.router.navigate(['./', event.item._id], { relativeTo: this.route });
  }

  onPage(pageEvent: PageEvent) {
    super.onPage(pageEvent);
    this.loadData();
  }

  onSort(event: Sort) {
    if (event.direction) {
      this.sortField = event.active;
      this.sortDirection = event.direction;
    } else {
      this.sortField = null;
      this.sortDirection = null;
    }
    this.loadData();
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
