import { NgModule } from '@angular/core';
import { DropdownListComponent } from './dropdown-list.component';
import {IonicModule} from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [DropdownListComponent],
  exports: [DropdownListComponent]
})
export class DropdownLsitComponentModule {}