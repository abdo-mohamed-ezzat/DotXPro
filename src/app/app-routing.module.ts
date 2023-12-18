import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'account-statement',
    loadChildren: () =>
      import('./pages/account-statement/account-statement.module').then(
        (m) => m.AccountStatementPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'items-inventory',
    loadChildren: () =>
      import('./pages/items-inventory/items-inventory.module').then(
        (m) => m.ItemsInventoryPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'net-sales',
    loadChildren: () =>
      import('./pages/net-sales/net-sales.module').then(
        (m) => m.NetSalesPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'sales-profit',
    loadChildren: () =>
      import('./pages/sales-profit/sales-profit.module').then(
        (m) => m.SalesProfitPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'income-statement',
    loadChildren: () =>
      import('./pages/income-statement/income-statement.module').then(
        (m) => m.IncomeStatementPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'balance-sheet',
    loadChildren: () =>
      import('./pages/balance-sheet/balance-sheet.module').then(
        (m) => m.BalanceSheetPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'buy-summery',
    loadChildren: () =>
      import('./pages/buy-summery/buy-summery.module').then(
        (m) => m.BuySummeryPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'trial-balance',
    loadChildren: () =>
      import('./pages/trial-balance/trial-balance.module').then(
        (m) => m.TrialBalancePageModule
      ),
      canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
  {
    path: 'splash',
    loadChildren: () =>
      import('./pages/splash/splash.module').then((m) => m.SplashPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    HttpClientModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
