import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SpinnerModule } from '@app/spinner/spinner.module';
import { IonicModule } from '@ionic/angular';
import { AlertModule } from '@app/components/alert/alert.module';
import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    SpinnerModule,
    AlertModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
