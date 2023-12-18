import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { BuySummeryPageRoutingModule } from './buy-summery-routing.module';
import { SelectChipsModule } from 'src/app/components/select-chips/select-chips.module';
import { BuySummeryPage } from './buy-summery.page';
import { MaterialModule } from './material.module';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuySummeryPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SelectChipsModule,
    SpinnerModule,
  ],
  declarations: [BuySummeryPage]
})
export class BuySummeryPageModule {}
