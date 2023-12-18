import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesProfitPage } from './sales-profit.page';

const routes: Routes = [
  {
    path: '',
    component: SalesProfitPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesProfitPageRoutingModule {}
