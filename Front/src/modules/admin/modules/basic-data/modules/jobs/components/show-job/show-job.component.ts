import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { TranslationService } from 'src/modules/shared/services';
import { JobsService } from '../../services';
import { Job } from '../../models/job.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/modules/shared/components';

@Component({
  selector: 'acc-show-job',
  templateUrl: './show-job.component.html',
  styleUrls: ['./show-job.component.scss']
})
export class ShowJobComponent extends SmartComponent implements OnInit, OnDestroy {

  job: Job;
  rights: {[key: string]: boolean};
  jobId: string;
  constructor(
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
    private jobsService: JobsService,
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
    this.job = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.jobId = snapshot.get('id');
          if (this.jobId) {
            this.loadData();
          }
        }
      );
  }
  loadData() {
    this.beforeLoadingData();
    this.jobsService.getJob(this.jobId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.job = res.job;
          this.rights = res.rights;
          this.jobsService.setAppRights(res.rights);
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  confirmDeleteJob() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DELETE_JOB',
        message: 'DELETE_CONFIRM',
        isDanger: true,
      }
    });
    dialogRef.afterClosed().subscribe(
      (confirm) => {
        if (confirm) {
          this.deleteJob();
        }
      }
    );
  }
  deleteJob() {
    this.beforeLoadingData();
    this.jobsService.deleteJob(this.job)
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
