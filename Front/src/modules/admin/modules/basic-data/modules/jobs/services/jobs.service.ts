import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filters } from 'src/modules/shared/models/filters-model';
import { apiUrl } from 'src/api-config';
import { Observable, ReplaySubject } from 'rxjs';
import { JobListResponse, JobResponse, Job } from '../models/job.model';

@Injectable()
export class JobsService {
  private rights$ = new ReplaySubject<{[key: string]: boolean}>(1);
  constructor(
    private http: HttpClient
  ) {
  }
  setAppRights(rights: {[key: string]: boolean}) {
    this.rights$.next(rights);
  }

  getAppRights() {
    return this.rights$.asObservable();
  }
  getJobs(filters: Filters): Observable<JobListResponse> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(
      (key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          httpParams = httpParams.set(key, filters[key]);
        }
      }
    );
    return this.http.get<JobListResponse>(`${apiUrl}/basicData/jobs`, { params: httpParams });
  }

  getJob(id: string): Observable<JobResponse> {
    return this.http.get<JobResponse>(`${apiUrl}/basicData/jobs/${id}`);
  }

  addJob(job: Job): Observable<JobResponse> {
    return this.http.post<JobResponse>(`${apiUrl}/basicData/jobs`, job);
  }

  editJob(job: Job): Observable<JobResponse> {
    return this.http.put<JobResponse>(`${apiUrl}/basicData/jobs/${job._id}`, { name: job.name });
  }

  deleteJob(job: Job): Observable<JobResponse> {
    return this.http.delete<JobResponse>(`${apiUrl}/basicData/jobs/${job._id}`);
  }

}


