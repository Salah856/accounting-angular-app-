import { Injectable } from '@angular/core';
import { map, distinctUntilChanged, debounceTime, startWith, tap, } from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
import { ResizeEvent } from '../models';


@Injectable()
export class ScreenService {
  private $windowResizeObservable: Observable<ResizeEvent>;
  private $windowScrollObservable: Observable<number>;

  constructor() {
    this.init();
  }

  init() {
    this.$windowResizeObservable = fromEvent(window, 'resize')
      .pipe(
        debounceTime(10),
        map(
          () => {
            return { width: window.innerWidth, height: window.innerHeight };
          }
        ),
        distinctUntilChanged(),
        startWith({ width: window.innerWidth, height: window.innerHeight }),
      );

    this.$windowScrollObservable = fromEvent(window, 'scroll')
      .pipe(
        debounceTime(10),
        map(
          () => {
            return window.scrollY;
          }
        ),
        distinctUntilChanged(),
        startWith(window.scrollY)
      );
  }


  getWindowSize(): Observable<ResizeEvent> {
    return this.$windowResizeObservable;
  }

  getWindowScrollPos(): Observable<number> {
    return this.$windowScrollObservable;
  }
}


