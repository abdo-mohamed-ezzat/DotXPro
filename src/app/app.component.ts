import { Component } from '@angular/core';
import { IUser } from './viewModels/iuser';
import { MenuController, ModalController, NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from './services/authentication.service';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import {App} from '@capacitor/app';
import { Router } from '@angular/router';
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
  private backButtonPressedOnce = false;
  user?: IUser | null;

  constructor(
    private authenticationService: AuthenticationService,
    private menuController: MenuController,
    private platform: Platform,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private router: Router
    ,  private modalCtrl: ModalController
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));

    this.platform.backButton.subscribeWithPriority(9999, async () => {
      const modal = await this.modalCtrl.getTop();
      if (this.router.url === '/home') {
        if (!this.backButtonPressedOnce) {
          this.backButtonPressedOnce = true;
          const toast = await this.toastCtrl.create({
            message: 'اضغط مرة اخرى للخروج',
            duration: 2000,
            position: 'bottom',
            color: 'primary',
            cssClass: 'toast-white-text'
          });
          toast.present();

          setTimeout(() => {
            this.backButtonPressedOnce = false;
          }, 2000);
        } else {
          App.exitApp();
        }
      } else {
        //if the page modal is open close it
        if (modal) {
          this.modalCtrl.dismiss();
        }
        else{
          this.navCtrl.navigateRoot('/home');
        }
      }
    });
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
