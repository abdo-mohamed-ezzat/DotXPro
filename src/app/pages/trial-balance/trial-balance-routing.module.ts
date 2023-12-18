import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrialBalancePage } from './trial-balance.page';

const routes: Routes = [
  {
    path: '',
    component: TrialBalancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrialBalancePageRoutingModule {}
