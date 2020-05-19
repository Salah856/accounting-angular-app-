// Angular imports
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Project imports
import { TreasuriesComponent } from './treasuries.component';
import { EditTreasuryComponent, ShowTreasuryComponent } from './components';


const routes: Routes = [
  { path: '', component: TreasuriesComponent },
  { path: 'add', component: EditTreasuryComponent },
  { path: 'edit/:id', component: EditTreasuryComponent },
  { path: ':id', component: ShowTreasuryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuriesRoutingModule { }
