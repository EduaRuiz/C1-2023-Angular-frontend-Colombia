import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AccountsDetailComponent } from './pages/accounts-detail';

// Modules
import { AccountRoutingModule } from './account-routing.module';
import { DepositsModule } from '../deposits/deposits.module';
import { TransfersModule } from '../transfers/transfers.module';



@NgModule({
  declarations: [
    AccountsDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    DepositsModule,
    TransfersModule,
  ]
})
export class AccountsModule { }
