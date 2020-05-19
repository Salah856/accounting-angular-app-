import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pass-mask-btn',
  templateUrl: './pass-mask-btn.component.html',
  styleUrls: ['./pass-mask-btn.component.scss']
})
export class PassMaskBtnComponent implements OnInit {
  passVisible = false;

  constructor() { }

  ngOnInit() {
  }

}
