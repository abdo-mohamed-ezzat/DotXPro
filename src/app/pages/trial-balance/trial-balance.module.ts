import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrialBalancePageRoutingModule } from './trial-balance-routing.module';
import { SelectChipsModule } from 'src/app/components/select-chips/select-chips.module';
import { TrialBalancePage } from './trial-balance.page';
import { MaterialModule } from './material.module';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrialBalancePageRoutingModule,
    MaterialModule,
    SelectChipsModule,
    SpinnerModule,
    ReactiveFormsModule,
  ],
  declarations: [TrialBalancePage]
})
export class TrialBalancePageModule {}
