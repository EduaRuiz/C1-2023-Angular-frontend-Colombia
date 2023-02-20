// Libraries
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Modules
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// Components
import { AppComponent } from './pages';
import { IndexComponent } from './pages/index/index';
import { environment } from 'src/environments/environment';

import { AuthInterceptor } from './interceptors';

registerLocaleData(localeEsCo, 'es-Co');

@NgModule({
  declarations: [AppComponent, IndexComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Co' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
  ]
})
export class AppModule { }
