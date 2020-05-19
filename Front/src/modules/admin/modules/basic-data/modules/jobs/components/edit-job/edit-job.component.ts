import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { Job } from '../../models/job.model';
import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'acc-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent extends SmartComponent implements OnInit, OnDestroy {
  job: Job;
  jobId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobsService: JobsService,
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
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }

  onSubmit() {
    let request = this.jobsService.addJob(this.job);
    if (this.jobId) {
      request = this.jobsService.editJob(this.job);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.jobId) {
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
