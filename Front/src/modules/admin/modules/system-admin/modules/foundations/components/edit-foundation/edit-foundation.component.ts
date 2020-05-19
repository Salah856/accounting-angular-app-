import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { Foundation } from 'src/modules/admin/models';
import { FoundationsService } from 'src/modules/admin/services/foundations.service';


@Component({
  selector: 'acc-edit-foundation',
  templateUrl: './edit-foundation.component.html',
  styleUrls: ['./edit-foundation.component.scss']
})
export class EditFoundationComponent extends SmartComponent implements OnInit, OnDestroy {
  foundation: Foundation;
  foundationId: string;
  parentFoundationId: string;

  constructor(
    private route: ActivatedRoute,
    private foundationsService: FoundationsService,
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
    this.route.queryParamMap.subscribe(
      (snapshot) => {
        this.parentFoundationId = snapshot.get('parent');
      }
    );
  }

  loadData() {
    this.beforeLoadingData();
    this.foundationsService.getFoundation(this.foundationId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.foundation = { ...(res.foundation as Foundation) };
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.foundationsService.addFoundation({ ...this.foundation, parent: this.parentFoundationId});
    if (this.foundationId) {
      request = this.foundationsService.editFoundation(this.foundation);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.foundationId) {
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
