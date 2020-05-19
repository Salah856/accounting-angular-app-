import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartComponent } from 'src/modules/shared/base-components/smart.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService, ToastService } from 'src/modules/shared/services';
import { ServerTranslatePipe } from 'src/modules/shared/pipes/server-translate.pipe';
import { User } from '../../models/user.model';

import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { UsersService } from 'src/modules/admin/services/users.service';


@Component({
  selector: 'acc-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent extends SmartComponent implements OnInit, OnDestroy {
  user: User;
  userId: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  get userImageLabel() {
    return this.user.imageUrl ?
      this.user.imageUrl.split('/')[this.user.imageUrl.split('/').length - 1]
      : 'NO_SELECTED_FILE';
  }
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private toastService: ToastService,
    private router: Router,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.user = {};
    this.route.paramMap
      .subscribe(
        (snapshot) => {
          this.userId = snapshot.get('id');
          if (this.userId) {
            this.loadData();
          }
        }
      );
  }

  loadData() {
    this.beforeLoadingData();
    this.usersService.getUser(this.userId)
      .subscribe(
        (res) => {
          this.afterLoadingData();
          this.user = { ...(res.user as User), password: null };
        },
        (err) => {
          this.afterLoadingData(err.error.message);
        }
      );
  }
  onFileChange(file: File) {
    this.user.image = file;
  }

  onSubmit() {
    let request = this.usersService.addUser(this.user);
    if (this.userId) {
      request = this.usersService.editUser(this.user);
    }
    this.beforeLoadingData();
    request.subscribe(
      (res) => {
        this.afterLoadingData();
        this.toastService.showSuccess(this.serverTranslatePipe.transform(res.message, this.lang));
        if (this.userId) {
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

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.user.phoneNumbers) {
        this.user.phoneNumbers = [];
      }
      this.user.phoneNumbers = [...this.user.phoneNumbers, value.trim()];
    }
    if (input) {
      input.value = '';
    }
  }

  remove(phoneNumber: string): void {
    const index = this.user.phoneNumbers.indexOf(phoneNumber);
    if (index >= 0) {
      this.user.phoneNumbers = [
        ...this.user.phoneNumbers.slice(0, index),
        ...this.user.phoneNumbers.slice(index + 1)
      ];
    }
  }
}
