import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { UpdateUserModel } from '../../../auth/models/update-user.model';
import { DocumentTypeEnum } from 'src/app/shared/enums';
import { AuthService } from '../../../auth/services/auth.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'sofka-bank-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit {

  @Input() userData!: UpdateUserModel;
  @Output() editUser = new EventEmitter<UpdateUserModel>();
  checkoutForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth$: AuthService,
  ) {
    this.checkoutForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(new RegExp(environment.regexEmail))
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(new RegExp(environment.regexPassword)),
      ]],
      fullName: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
      ]],
      phone: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
        Validators.pattern(new RegExp('^[0-9]+$'))
      ]],
      documentTypeId: ['CC', Validators.required],
      document: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern(new RegExp('^[0-9]+$'))
      ]],
      avatarUrl: ['', [
      ]],
    });
  }

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      email: [this.userData.email, [
        Validators.required,
        Validators.pattern(new RegExp(environment.regexEmail))
      ]],
      password: ['888', [
        Validators.required,
        Validators.pattern(new RegExp(environment.regexPassword)),
      ]],
      fullName: [this.userData.fullName, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
      ]],
      phone: [this.userData.phone, [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
        Validators.pattern(new RegExp('^[0-9]+$'))
      ]],
      documentTypeId: ['CC', Validators.required],
      document: [this.userData.document, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern(new RegExp('^[0-9]+$'))
      ]],
      avatarUrl: [this.userData.avatarUrl, [
      ]],
    });
  }

  changeProfile() {
    this.userData = { ...this.checkoutForm.getRawValue() }
    this.editUser.emit(this.userData);
  }
  onSubmit(): void {
    const user = <UpdateUserModel>this.checkoutForm.value
    switch (this.checkoutForm.value.documentTypeId) {
      case 'CC': user.documentTypeId = DocumentTypeEnum.CC;
        break;
      case 'CE': user.documentTypeId = DocumentTypeEnum.CE;
        break;
      default: user.documentTypeId = DocumentTypeEnum.CC;
    }
    if (user.avatarUrl === '') user.avatarUrl = undefined;
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.valid) {
      this.auth$.updateUserInfo(user).subscribe({
        next: (data) => this.handlerSuccess(),
        error: (err: Error)=> this.handlerError(err),
      });
      this.userData
    }
  }

  handlerValidators(param: 'email' | 'password' | 'fullName' | 'phone' | 'document' | 'documentTypeId' | 'avatarUrl'): string {
    return this.checkoutForm.controls[param].errors && this.checkoutForm.controls[param].touched ? 'is-invalid' : ''
  }

  handlerMessage(param: 'email' | 'password' | 'fullName' | 'phone' | 'document' | 'documentTypeId' | 'avatarUrl'): string {
    const messages = {
      pattern: `Please provide a valid ${param}`,
      required: `Enter ${param} here`,
      minlength: ` chars minimum`,
      maxlength: ` chars maximum`,
    }
    let message = '';
    const errorValue = (Object.values(this.checkoutForm.controls[param].errors ?? {})[0])
    const errorKey = (Object.keys(this.checkoutForm.controls[param].errors ?? {}))[0]
    switch (errorKey) {
      case 'required': message = messages.required
        break
      case 'pattern': message = messages.pattern//+param==='email'?'. The password must be at least 8 characters and contain at least 1 lowercase, 1 uppercase, and 1 number.':''
        break
      case 'minlength': message = errorValue?.requiredLength + messages.minlength
        break
      case 'maxlength': message = errorValue?.requiredLength + messages.maxlength
        break
    }
    return message;
  }

  private handlerSuccess(): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Done',
      showConfirmButton: false,
      timer: 1000
    })
  }

  private handlerError(err: Error): void {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message,
    })
  }

}
