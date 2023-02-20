import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsDetailComponent } from './pages/accounts-detail';

const routes: Routes = [
  { path: '', component: AccountsDetailComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  //{ path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
