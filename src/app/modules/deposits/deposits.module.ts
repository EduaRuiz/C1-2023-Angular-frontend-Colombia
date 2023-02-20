// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { NewDepositComponent } from './components/new-deposit';
import { DepositsDetailComponent } from './pages/deposits-detail';

// Modules
import { DepositsRoutingModule } from './deposits-routing.module';
import { SharedModule } from 'src/app/shared';

@NgModule({
  declarations: [
    DepositsDetailComponent,
    NewDepositComponent,
  ],
  imports: [
    CommonModule,
    DepositsRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
  ],
  exports: [
    NewDepositComponent,
  ]
})
export class DepositsModule { }
