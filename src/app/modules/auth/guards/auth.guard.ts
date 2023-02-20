// Libraries
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

//Services
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly auth$: AuthService,
    private readonly router: Router,
  ) { }

  canActivate(): Observable<boolean> | boolean {
    return this.auth$.refreshToken()
      .pipe(
        tap(valid => {
          if (!valid) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('googleToken');
            this.router.navigate(['index']);
          }
        }));
  }

  canLoad(): Observable<boolean> | boolean {
    return this.auth$.refreshToken()
      .pipe(
        tap(valid => {
          if (!valid) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('googleToken');
            this.router.navigate(['index']);
          }
        }));
  }
}
