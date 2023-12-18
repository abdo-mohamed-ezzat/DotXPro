import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuySummeryPage } from './buy-summery.page';

const routes: Routes = [
  {
    path: '',
    component: BuySummeryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuySummeryPageRoutingModule {}
