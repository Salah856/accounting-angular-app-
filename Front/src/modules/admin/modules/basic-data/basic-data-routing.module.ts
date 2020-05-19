// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { BasicDataComponent } from './basic-data.component';


const routes: Routes = [
  {
    path: '',
    component: BasicDataComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'companies',
      //   pathMatch: 'full'
      // },
      {
        path: 'companies',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/companies/companies.module#CompaniesModule'
      },
      {
        path: 'jobs',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/jobs/jobs.module#JobsModule'
      },
      {
        path: 'itemTypes',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/item-types/item-types.module#ItemTypesModule'
      },
      {
        path: 'itemCategories',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/item-categories/item-categories.module#ItemCategoriesModule'
      },
      {
        path: 'itemUnits',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/item-units/item-units.module#ItemUnitsModule'
      },
      {
        path: 'currencies',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/currencies/currencies.module#CurrenciesModule'
      },
      {
        path: 'paymentClauses',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/payment-clauses/payment-clauses.module#PaymentClausesModule'
      },
      {
        path: 'receiptClauses',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/receipt-clauses/receipt-clauses.module#ReceiptClausesModule'
      },
      {
        path: 'stores',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/stores/stores.module#StoresModule'
      },
      {
        path: 'treasuries',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/treasuries/treasuries.module#TreasuriesModule'
      },
      {
        path: 'items',
        loadChildren: 'src/modules/admin/modules/basic-data/modules/items/items.module#ItemsModule'
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicDataRoutingModule { }
