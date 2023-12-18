import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountStatementPageModule } from '../account-statement/account-statement.module';
import { IonicModule } from '@ionic/angular';
import { AccountStatmentOptionsModule } from '../../components/account-statment-options/account-statment-options.module';
import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    AccountStatementPageModule,
    AccountStatmentOptionsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {

constructor(){

}

}
