// import { MediaMatcher } from '@angular/cdk/layout';
// import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit } from '@angular/core';


// /** @title Responsive sidenav */
// @Component({
//   selector: 'app-full-layout',
//   templateUrl: 'full.component.html',
//   styleUrls: []
// })
// export class FullComponent implements OnDestroy, AfterViewInit {
//   mobileQuery: MediaQueryList;

//   private _mobileQueryListener: () => void;

//   constructor(
//     changeDetectorRef: ChangeDetectorRef,
//     media: MediaMatcher
//   ) {
//     this.mobileQuery = media.matchMedia('(min-width: 768px)');
//     this._mobileQueryListener = () => changeDetectorRef.detectChanges();
//     this.mobileQuery.addListener(this._mobileQueryListener);
//   }

//   ngOnDestroy(): void {
//     this.mobileQuery.removeListener(this._mobileQueryListener);
//   }
//   ngAfterViewInit() { }
// }
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  // styleUrls: ['./full.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize change detection
})
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngAfterViewInit() { }
}
