import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

// Guard
import { SharedGuard } from '../main/guards/shared.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [SharedGuard],
    canLoad: [SharedGuard],
    children: [
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'reset-pass', component: ResetPasswordComponent },
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { path: '**', redirectTo: 'signin' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
