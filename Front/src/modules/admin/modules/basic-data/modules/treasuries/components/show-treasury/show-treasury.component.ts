import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { TreasuriesService } from '../../services';
import { Treasury, TreasuryPopulated } from '../../models/treasury.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';

@Component({
  selector: 'acc-show-treasury',
  templateUrl: './show-treasury.component.html',
  styleUrls: ['./show-treasury.component.scss']
})
export class ShowTreasuryComponent extends SmartComponent implements OnInit, OnDestroy {

  treasury: TreasuryPopulated;
  rights: {[key: string]: boolean};
  treasuryId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private treasuriesService: TreasuriesService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.treasury = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.treasuryId = snapshot.get('id');
          if (this.treasuryId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.treasuriesService.getTreasury(this.treasuryId, true)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.treasury = res.treasury as TreasuryPopulated;
          this.rights = res.rights;
          this.treasuriesService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteTreasury() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_TREASURY',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteTreasury();
        }
      }
    );
  }
  deleteTreasury() {
    this.beforeLoadingData();
    this.treasuriesService.deleteTreasury(this.treasury)
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
