import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';
import { FoundationPopulated } from 'src/modules/admin/models';
import { FoundationsService } from 'src/modules/admin/services/foundations.service';

@Component({
  selector: 'acc-show-foundation',
  templateUrl: './show-foundation.component.html',
  styleUrls: ['./show-foundation.component.scss']
})
export class ShowFoundationComponent extends SmartComponent implements OnInit, OnDestroy {

  foundation: FoundationPopulated;
  rights: {[key: string]: boolean};
  foundationId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private foundationsService: FoundationsService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private toastService: ToastService
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.foundation = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.foundationId = snapshot.get('id');
          if (this.foundationId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.foundationsService.getFoundation(this.foundationId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.foundation = res.foundation as FoundationPopulated;
          this.rights = res.rights;
          this.foundationsService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteFoundation() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_FOUNDATION',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteFoundation();
        }
      }
    );
  }
  deleteFoundation() {
    this.beforeLoadingData();
    this.foundationsService.deleteFoundation(this.foundation)
      .subscribe(
        (data) => {
          this.afterLoadingData();
          this.router.navigate(['../'], { relativeTo: this.route });
          this.toastService.showSuccess(
            this.serverTranslatePipe.transform(data.message, this.lang)
          );
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
