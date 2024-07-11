import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualSCrollingTableComponent } from './virtual-scrolling-table.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  declarations: [VirtualSCrollingTableComponent],
  imports: [CommonModule, ScrollingModule],
  exports: [VirtualSCrollingTableComponent],
})
export class VirtualSCrollingTableModule {}
