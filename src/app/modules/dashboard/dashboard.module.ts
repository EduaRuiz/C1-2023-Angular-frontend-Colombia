// Libraries
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';

// Modules
import { CustomerModule } from '../customer/customer.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared';

@NgModule({
  declarations: [
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    CustomerModule,
    FormsModule,
    NgbModule,
    SharedModule,
  ],
  exports: [NavbarComponent]
})

export class DashboardModule { }