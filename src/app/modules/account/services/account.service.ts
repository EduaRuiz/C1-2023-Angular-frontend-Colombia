import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AccountInterface, PageAccountsInterface } from '../interfaces';

import { PaginationModel } from '../../../shared/models';
import { NewAccountModel } from '../models';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService implements AsyncValidator {

  private readonly uri = environment.baseUrl + 'accounts'

  constructor(private readonly http: HttpClient) {
  }
  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
    const accountId = control.value;
    return this.http.get<boolean>(`${this.uri}/exist/${accountId}`)
      .pipe(
        delay(1000),
        map(resp => { console.log(resp); return resp ? null : { exist: false } }));
  }

  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }

  getAccounts(pagination: PaginationModel): Observable<PageAccountsInterface> {
    return this.http.post<PageAccountsInterface>(this.uri + '/all', pagination);
  }

  deleteAccount(accountId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.uri + '/' + accountId);
  }

  createAccount(newAccount: NewAccountModel): Observable<boolean> {
    return this.http.post<boolean>(this.uri + '/add', newAccount);
  }

  getAnyAccountById(accountId: string): Observable<AccountInterface> {
    return this.http.get<AccountInterface>(this.uri + '/anyaccount/' + accountId);
  }
}

