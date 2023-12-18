import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ItemsInventoryPageRoutingModule } from './items-inventory-routing.module';
import { SelectChipsModule } from 'src/app/components/select-chips/select-chips.module';
import { DateInputModule } from 'src/app/components/date-input/date-input.module';
import {MaterialModule} from './material.module'
import { ItemsInventoryPage } from './items-inventory.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling'; 
import { SpinnerModule } from 'src/app/spinner/spinner.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsInventoryPageRoutingModule,
    SelectChipsModule,
    DateInputModule,
    MaterialModule, 
    ReactiveFormsModule,
    ScrollingModule,
    SpinnerModule
  ],
  declarations: [ItemsInventoryPage],
})
export class ItemsInventoryPageModule {}
