import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IonicModule } from '@ionic/angular';
import { SelectChipsModule } from 'src/app/components/select-chips/select-chips.module';
import { IncomeStatementPageRoutingModule } from './income-statement-routing.module';
import { SpinnerModule } from 'src/app/spinner/spinner.module';
import { IncomeStatementPage } from './income-statement.page';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomeStatementPageRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    SelectChipsModule,
    SpinnerModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    ScrollingModule
  ],
  declarations: [IncomeStatementPage]
})
export class IncomeStatementPageModule {}
