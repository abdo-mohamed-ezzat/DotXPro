import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NetSalesPage } from './net-sales.page';

const routes: Routes = [
  {
    path: '',
    component: NetSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetSalesPageRoutingModule {}
