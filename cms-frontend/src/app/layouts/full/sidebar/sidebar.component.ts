// import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
// import { MediaMatcher } from '@angular/cdk/layout';
// import { MenuItems } from 'src/app/shared/menu-items';
// import { jwtDecode } from 'jwt-decode';
// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
//   styleUrls: []
// })
// export class AppSidebarComponent implements OnDestroy {
//   mobileQuery: MediaQueryList;
//   token = localStorage.getItem('token');
//   tokenPayload: any;

//   private _mobileQueryListener: () => void;

//   constructor(
//     changeDetectorRef: ChangeDetectorRef,
//     media: MediaMatcher,
//     public menuItems: MenuItems
//   ) {
//     this.tokenPayload = jwtDecode(this.token!)
//     this.mobileQuery = media.matchMedia('(min-width: 768px)');
//     this._mobileQueryListener = () => changeDetectorRef.detectChanges();
//     this.mobileQuery.addListener(this._mobileQueryListener);
//   }

//   ngOnDestroy(): void {
//     this.mobileQuery.removeListener(this._mobileQueryListener);
//   }
// }
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from 'src/app/shared/menu-items';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  role: string;
  // Add other expected properties
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']

})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  token = localStorage.getItem('token');
  tokenPayload: TokenPayload | null = null;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems
  ) {
    this.decodeToken();
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  private decodeToken() {
    try {
      if (this.token) {
        this.tokenPayload = jwtDecode<TokenPayload>(this.token);
      }
    } catch (error) {
      console.error('Invalid token:', error);
      this.tokenPayload = null;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
