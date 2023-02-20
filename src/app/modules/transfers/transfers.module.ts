// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { NewTransferComponent } from './components/new-transfer/';
import { TransfersDetailComponent } from './pages/transfers-detail';

// Modules
import { TransfersRoutingModule } from './transfers-routing.module';
import { SharedModule } from 'src/app/shared';

@NgModule({
  declarations: [
    TransfersDetailComponent,
    NewTransferComponent,
  ],
  imports: [
    CommonModule,
    TransfersRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule,
  ],
  exports: [
    NewTransferComponent,
  ]
})
export class TransfersModule { }
