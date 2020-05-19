import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'acc-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() accept: string;
  @Input() required = true;
  @Input() buttonText = 'UPLOAD_FILE';
  @Input() noFileLabel = 'NO_SELECTED_FILE';
  @Output() fileChanged: EventEmitter<File> = new EventEmitter();
  file: File;
  ngOnInit() {
  }

  onFileChanged(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileChanged.emit(this.file);
    }
  }

}
