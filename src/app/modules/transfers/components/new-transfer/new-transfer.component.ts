import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransferInterface } from '../../interfaces';
import { TransferService } from '../../services';

import { environment } from 'src/environments/environment';
import { NewTransferModel } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountInterface } from 'src/app/modules/account';
import { AccountService } from '../../../account/services/account.service';
import { CompareValidator } from '../../../../shared/validators';

@Component({
  selector: 'sofka-bank-new-transfer',
  templateUrl: './new-transfer.component.html',
  styleUrls: ['./new-transfer.component.scss']
})
export class NewTransferComponent implements OnInit {

  @Input() incomeAccounts!: AccountInterface[];
  @Input() outcomeAccount!: AccountInterface;
  @Input() maxAmount!: number;
  @Output() added = new EventEmitter<boolean>();
  amount!: number;
  reason!: string;
  checkoutForm!: FormGroup;
  incomeAccountId!: string;

  constructor (
    private readonly transfer$: TransferService,
    private readonly formBuilder: FormBuilder,
    private readonly account$: AccountService,
  ) { }

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      amount: [0, [
        Validators.required,
        Validators.nullValidator,
        Validators.min(1),
        Validators.max(this.outcomeAccount.balance),
        Validators.pattern(new RegExp(/^[0-9]+$/)),
      ]],
      reason: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.nullValidator,
      ]],
      incomeAccountId: ['', [
        Validators.required,
        Validators.nullValidator,
        CompareValidator.diferent(this.outcomeAccount.id),
        Validators.pattern(new RegExp(environment.regexUUID)),
      ], [this.account$]],
    });
    this.incomeAccounts = JSON.parse(JSON.stringify(this.incomeAccounts));
    this.incomeAccountId = this.checkoutForm.value.incomeAccountId;
    const a = this.incomeAccounts.find(a => a.id === this.outcomeAccount.id);
    let b: number;
    if (a) { b = this.incomeAccounts.indexOf(a) }
    else { b = -1 };
    if (b >= 0) { this.incomeAccounts.splice(b, 1) };
  }

  onSubmit(): void {
    this.incomeAccountId = this.checkoutForm.value.incomeAccountId;
    this.amount = this.checkoutForm.value.amount;
    this.reason = this.checkoutForm.value.reason;
    this.checkoutForm.markAllAsTouched();
    const transfer = new NewTransferModel(this.outcomeAccount.id, this.incomeAccountId, this.amount, this.reason);
    if (this.checkoutForm.valid) {
      this.transfer$.addTransfer(transfer).subscribe({
        next: (data: TransferInterface) => this.added.emit(true),
        error: (err: Error) => console.log(err)
      });
    };
  }

  onIncomeAccountIs(): void {
    console.log(this.checkoutForm.controls['incomeAccountId'].reset());
  }

  handlerValidators(param: 'amount' | 'reason' | 'incomeAccountId'): string {
    console.log(this.checkoutForm.controls[param].errors);
    return this.checkoutForm.controls[param].errors && this.checkoutForm.controls[param].touched ? 'is-invalid' : '';
  }

  handlerMessage(param: 'amount' | 'reason' | 'incomeAccountId'): string {
    const messages = {
      pattern: `Please provide a valid ${param}`,
      required: `Enter ${param} here`,
      min: ` USDs minimum`,
      max: ` USDs maximum`,
      minlength: ` chars minimum`,
      exist: 'income account id does not exist.',
      same: 'Same id is not valid.',
    };
    let message = '';
    const errorValue = (Object.values(this.checkoutForm.controls[param].errors ?? {})[0]);
    const errorKey = (Object.keys(this.checkoutForm.controls[param].errors ?? {}))[0];
    switch (errorKey) {
      case 'required': message = messages.required
        break
      case 'pattern': message = messages.pattern
        break
      case 'min': message = errorValue?.min + messages.min
        break
      case 'max': message = errorValue?.max + messages.max + '. Current amount exceeds current balance.'
        break
      case 'minlength': message = errorValue?.requiredLength + messages.minlength
        break
      case 'exist': message = messages.exist
        break
      case 'same': message = messages.same
        break
    };
    return message;
  }
}
