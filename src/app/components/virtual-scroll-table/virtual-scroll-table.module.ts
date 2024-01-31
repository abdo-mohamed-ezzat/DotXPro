import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VirtualScrollTableComponent} from './virtual-scroll-table.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';


@NgModule({
  imports: [CommonModule,
    ScrollingModule,
    MatTableModule,
    MatSortModule,
    CdkTableModule,
],
  declarations: [VirtualScrollTableComponent],
  exports: [VirtualScrollTableComponent],
})

export class VirtualScrollTableModule {
}