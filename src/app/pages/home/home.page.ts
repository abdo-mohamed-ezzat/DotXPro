import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { AccountStatmentOptionsComponent } from 'src/app/components/account-statment-options/account-statment-options.component';
import { APIQueriesDetailsService } from 'src/app/services/apiqueries-details.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public pages = [
    {
      title: 'كشف حساب',
      url: '/account-statement',
      icon: 'assets/home-images/2.gif',
    },
    {
      title: 'قائمة الدخل',
      url: '/income-statement',
      icon: 'assets/home-images/7.gif',
    },
    {
      title: 'المركز المالي',
      url: '/balance-sheet',
      icon: 'assets/home-images/1.gif',
    },
    {
      title: 'ميزان المراجعة',
      url: '/trial-balance',
      icon: 'assets/home-images/8.gif',
    },
    {
      title: 'صافي مشتريات',
      url: '/buy-summery',
      icon: 'assets/home-images/6.gif',
    },
    {
      title: 'صافي مبيعات',
      url: '/net-sales',
      icon: 'assets/home-images/4.gif',
    },
    {
      title: 'ارباح مبيعات',
      url: '/sales-profit',
      icon: 'assets/home-images/5.gif',
    },
    {
      title: 'مخزون اصناف',
      url: '/items-inventory',
      icon: 'assets/home-images/3.gif',
    },
  ];

  constructor(private router: Router) {}

  goToPage(url: string) {
    this.router.navigateByUrl(url);
  }

  ngOnInit() {}
}
