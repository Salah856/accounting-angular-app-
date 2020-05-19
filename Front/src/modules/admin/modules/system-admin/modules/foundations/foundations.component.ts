import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

import { ScopeItem } from 'src/modules/shared/components/scope/models/scope.model';
import { Subscription } from 'rxjs';
import { FoundationsService } from 'src/modules/admin/services/foundations.service';


@Component({
  selector: 'acc-foundations',
  templateUrl: './foundations.component.html',
  styleUrls: ['./foundations.component.scss']
})
export class FoundationsComponent implements OnInit, OnDestroy {
  selectedNodeId: string;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  rights: {[key: string]: boolean};
  subscription: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private foundationsService: FoundationsService,

  ) {

  }

  ngOnInit() {
    this.init();
    this.subscription = this.foundationsService.getAppRights()
    .subscribe(rights => this.rights = rights);
  }

  init() {
    this.mobileQuery = this.media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.route.paramMap
    .subscribe(
      (snapshot) => {
        this.selectedNodeId = snapshot.get('id');
      }
    );
  }
  onNodeClick(node: ScopeItem) {
    const base = this.selectedNodeId ? '../' : './';
    this.router.navigate([base, node.id], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

}
