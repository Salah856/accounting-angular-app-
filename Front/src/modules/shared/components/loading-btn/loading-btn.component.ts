import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'acc-loading-btn',
  templateUrl: './loading-btn.component.html',
})
export class LoadingBtnComponent implements OnInit {
  @Input() submit = false;
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() isDanger = false;
  @Input() isOutline = false;
  @Input() isAction = false;
  @Input() isLarge = false;
  constructor() { }

  ngOnInit() {
  }

}
