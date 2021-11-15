import { FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn} from '@angular/forms';
import PhoneNumber from 'awesome-phonenumber';
import {ErrorStateMatcher} from '@angular/material/core';

export const phoneValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const num = control.get('number');
    const country = control.get('country');
    if (num?.value && country?.value && !(new PhoneNumber(num.value, country.value).isValid())) {
        return {invalidPhone: true};
    } else {
        return null;
    }
};

export class PhoneErrorMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(control.value && control.touched && !control?.parent?.valid);
    }
}