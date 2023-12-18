import { Component } from '@angular/core';
import { IUser } from './viewModels/iuser';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from './services/authentication.service';
import { StatusBar } from '@capacitor/status-bar';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public appPages = [
    { title: 'الصفحة الرئيسية', url: '/home', icon: 'home' },
    { title: 'كشف حساب', url: '/account-statement', icon: 'search-circle' },
    { title: 'قائمة الدخل', url: '/income-statement', icon: 'reader' },
    {
      title: 'المركز المالي',
      url: '/balance-sheet',
      icon: 'stats-chart',
    },
    { title: 'ميزان مراجعة', url: '/trial-balance', icon: 'warning' },
    { title: 'صافي مشتريات', url: '/buy-summery', icon: 'receipt' },
    { title: 'صافي مبيعات', url: '/net-sales', icon: 'cash' },
    { title: 'ارباح مبيعات', url: '/sales-profit', icon: 'trending-up' },
    { title: 'مخزون اصناف', url: '/items-inventory', icon: 'server' },
  ];

  user?: IUser | null;

  constructor(
    private authenticationService: AuthenticationService,
    private menuController: MenuController
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(){
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setBackgroundColor({ color: '#1d4188' });
  }

  logout() {
    this.menuController.close();
    this.authenticationService.logout();
  }
}
