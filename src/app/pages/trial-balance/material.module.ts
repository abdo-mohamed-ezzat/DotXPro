import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { NgModule } from '@angular/core';
import { VirtualSCrollingTableModule } from '@app/components/virtual-scrolling-table/virtual-scrolling-table.module';
@NgModule({
  exports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatBadgeModule,
    VirtualSCrollingTableModule
  ],
})
export class MaterialModule {}