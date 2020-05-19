import { Injectable } from '@angular/core';

const prefix = '5be053d20fe18701acabeb93';
@Injectable()
export class LocalStorageService {

  get(key: string, isJson: boolean): any {
    let value = localStorage.getItem(`${prefix}_${key}`);
    value = value && isJson ? JSON.parse(value) : value;
    return value;
  }

  set(key: string, value: any, isJson: boolean): void {
    const val = value && isJson ? JSON.stringify(value) : value;
    localStorage.setItem(`${prefix}_${key}`, val);
  }

  remove(key: string): void {
    localStorage.removeItem(`${prefix}_${key}`);
  }

  clear(): void {
    localStorage.clear();
  }


}
