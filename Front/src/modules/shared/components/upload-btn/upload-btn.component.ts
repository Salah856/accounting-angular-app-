import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'acc-upload-btn',
  templateUrl: './upload-btn.component.html',
  styleUrls: ['./upload-btn.component.scss']
})
export class UploadBtnComponent implements OnInit {
  @Output() onFileChange = new EventEmitter<any>();
  @Input() acceptedExtensions: string;
  @Input() disabled: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  onChange(file) {
    this.onFileChange.emit(file);
  }

}
