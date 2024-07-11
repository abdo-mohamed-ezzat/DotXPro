import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import { IonicModule } from '@ionic/angular';
import { SelectChipsModule } from 'src/app/components/select-chips/select-chips.module';
import { SalesProfitPageRoutingModule } from './sales-profit-routing.module';
import { SalesProfitPage } from './sales-profit.page';
import { MaterialModule } from './material.module';
import { VirtualSCrollingTableModule } from '@app/components/virtual-scrolling-table/virtual-scrolling-table.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesProfitPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SelectChipsModule,
    SpinnerModule,
    VirtualSCrollingTableModule
  ],
  declarations: [SalesProfitPage]
})
export class SalesProfitPageModule {}
