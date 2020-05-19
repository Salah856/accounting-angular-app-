// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { CompaniesComponent } from './companies.component';
import { EditCompanyComponent, ShowCompanyComponent } from './components';


const routes: Routes = [
  { path: '', component: CompaniesComponent },
  { path: 'add', component: EditCompanyComponent },
  { path: 'edit/:id', component: EditCompanyComponent },
  { path: ':id', component: ShowCompanyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
