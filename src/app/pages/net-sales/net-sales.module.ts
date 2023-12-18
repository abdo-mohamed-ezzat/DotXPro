import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonicModule } from '@ionic/angular';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import { NetSalesPageRoutingModule } from './net-sales-routing.module';
import { NetSalesPage } from './net-sales.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MaterialModule} from './material.moudle';
import { SelectChipsModule } from 'src/app/components/select-chips/select-chips.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NetSalesPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    ScrollingModule,
    SelectChipsModule,
    SpinnerModule
  ],
  declarations: [NetSalesPage]
})
export class NetSalesPageModule {}
