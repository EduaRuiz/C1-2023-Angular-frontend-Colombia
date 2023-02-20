// Libraries
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components 
import { TransfersDetailComponent } from './pages/transfers-detail/transfers-detail.component';

const routes: Routes = [

  { path: '', component: TransfersDetailComponent },
  { path: ':id', component: TransfersDetailComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  //{ path: '**', redirectTo: '' },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfersRoutingModule { }
