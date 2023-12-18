import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TableComponent } from "./table.component";
import { CommonModule } from '@angular/common';

@NgModule ({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [TableComponent],
  exports: [TableComponent]
})

export class TableComponentModule {
  constructor() {}
}