import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'acc-user-btn',
  templateUrl: './user-btn.component.html',
  styleUrls: ['./user-btn.component.scss']
})
export class UserBtnComponent {
  @Input() name = 'user';
  @Input() imageUrl: string;
  @Output() logout = new EventEmitter<boolean>();

  onLogout() {
    this.logout.emit(true);
  }
}
