import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from './api.service';
import { firstValueFrom } from 'rxjs';
import { SplashScreen } from '@capacitor/splash-screen';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  constructor(private apiService: APIService, private router: Router,
    private navCtrl: NavController,) {}
    init() {
      return firstValueFrom(this.apiService.checkToken()).then(isValid => {
        if (isValid) {
          this.navCtrl.navigateRoot('/home');
          setTimeout(() => {
            SplashScreen.hide();
          }, 1500);
        } else {
          this.navCtrl.navigateRoot('/login');
          setTimeout(() => {
            SplashScreen.hide();
          }, 1500);
        }
      }).catch(error => {
        setTimeout(() => {
          SplashScreen.hide();
        }, 1500); 
    
        console.error('Error checking token:', error);
        this.navCtrl.navigateRoot('/login');
      });
    }
  }