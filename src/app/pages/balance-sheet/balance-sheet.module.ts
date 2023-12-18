import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BalanceSheetPageRoutingModule } from './balance-sheet-routing.module';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import { BalanceSheetPage } from './balance-sheet.page';
import { SelectChipsModule } from '@app/components/select-chips/select-chips.module';
import { DateInputModule } from '@app/components/date-input/date-input.module';
import { MaterialModule } from './material.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceSheetPageRoutingModule,
    SpinnerModule,
    ReactiveFormsModule,
    SelectChipsModule,
    DateInputModule,
    MaterialModule,
  ],
  declarations: [BalanceSheetPage]
})
export class BalanceSheetPageModule {}
