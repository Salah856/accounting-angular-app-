import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { Treasury, TreasuryOptions } from '../../models/treasury.model';
import { TreasuriesService } from '../../services/treasuries.service';


import * as moment from 'moment';
import { Observable, forkJoin } from 'rxjs';


@Component({
  selector: 'acc-edit-treasury',
  templateUrl: './edit-treasury.component.html',
  styleUrls: ['./edit-treasury.component.scss']
})
export class EditTreasuryComponent extends SmartComponent implements OnInit, OnDestroy {
  treasury: Treasury;
  treasuryId: string;
  treasuryOptions: TreasuryOptions;
  maxDate = new Date().toISOString();
  constructor(
    private route: ActivatedRoute,
    private treasuriesService: TreasuriesService,
    private toastService: ToastService,
    private router: Router,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
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
          this.loadData();
        }
      );
  }

  loadData() {
    this.beforeLoadingData();
    const requests: Observable<any>[] = [
      this.treasuriesService.getOptions()
    ];
    if (this.treasuryId) {
      requests.push(
        this.treasuriesService.getTreasury(this.treasuryId)
      );
    }
    forkJoin(requests)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.treasuryOptions = res[0].options;
          if (this.treasuryId) {
            this.treasury = res[1].treasury;
          }
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    this.treasury = {
      ...this.treasury,
      createdAt: this.treasury.createdAt ? moment(this.treasury.createdAt).toISOString() : null,
    };

    let request = this.treasuriesService.addTreasury(this.treasury);
    if (this.treasuryId) {
      request = this.treasuriesService.editTreasury(this.treasury);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.treasuryId) {
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
