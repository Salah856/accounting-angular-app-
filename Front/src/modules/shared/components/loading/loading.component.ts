import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'acc-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() roundedOverlay = true;
  constructor() { }

  ngOnInit() {
  }

}
