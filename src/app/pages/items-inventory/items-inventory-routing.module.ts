import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsInventoryPage } from './items-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: ItemsInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsInventoryPageRoutingModule {}
