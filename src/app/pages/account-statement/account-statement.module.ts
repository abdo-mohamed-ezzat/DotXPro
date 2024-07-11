import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountStatementPageRoutingModule } from './account-statement-routing.module';
import { IonicModule } from '@ionic/angular';
import { TableComponentModule } from '../../components/table/table.module';
import { DropdownLsitComponentModule } from '../../components/dropdown-list/dropdown-list.module';
import { AccountStatementPage } from './account-statement.page';
import { SelectChipsModule } from '../../components/select-chips/select-chips.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from './material.module';
import { TotalPipe } from '@app/pipes/total.pipe';
import { GroupByPipe } from '@app/pipes/group-by.pipe';
import { VirtualSCrollingTableModule } from '@app/components/virtual-scrolling-table/virtual-scrolling-table.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountStatementPageRoutingModule,
    DropdownLsitComponentModule,
    TableComponentModule,
    SelectChipsModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatFormFieldModule,
    MaterialModule,
    VirtualSCrollingTableModule,
  ],
  declarations: [AccountStatementPage, TotalPipe, GroupByPipe],
  providers: [DatePipe, CdkVirtualScrollViewport],
})
export class AccountStatementPageModule {}
