import { Validator, AbstractControl, ValidationErrors } from '@angular/forms';

export class CompareValidator implements Validator {
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    throw new Error('Method not implemented.');
  }

  static diferent(compare: string): ValidationErrors | null {
    return (control: AbstractControl<any, any>) => {
      return (compare === control.value) ? { diferent: false } : null
    };
  }
  static same(compare: string): ValidationErrors | null {
    return (control: AbstractControl<any, any>) => {
      return (compare !== control.value) ? { same: false } : null
    };
  }
}