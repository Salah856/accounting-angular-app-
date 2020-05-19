import { Injectable } from '@angular/core';

const prefix = '5be053d20fe18701acabeb93';
@Injectable()
export class SessionStorageService {

  get(key: string, isJson: boolean): any {
    let value = sessionStorage.getItem(`${prefix}_${key}`);
    value = value && isJson ? JSON.parse(value) : value;
    return value;
  }

  set(key: string, value: any, isJson: boolean): void {
    const val = value && isJson ? JSON.stringify(value) : value;
    sessionStorage.setItem(`${prefix}_${key}`, val);
  }

  remove(key: string): void {
    sessionStorage.removeItem(`${prefix}_${key}`);
  }

  clear(): void {
    sessionStorage.clear();
  }


}
