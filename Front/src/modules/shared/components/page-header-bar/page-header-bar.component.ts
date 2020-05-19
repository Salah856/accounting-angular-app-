import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'acc-page-header-bar',
  templateUrl: './page-header-bar.component.html',
  styleUrls: ['./page-header-bar.component.scss']
})
export class PageHeaderBarComponent implements OnInit {
  @Input() title: string;
  @Input() subText: string;
  @Input() sideNav: any;
  @Input() sideNavIconCloseToolTip: string;
  @Input() sideNavIconOpenToolTip: string;

  constructor() { }

  ngOnInit() {
  }

}
