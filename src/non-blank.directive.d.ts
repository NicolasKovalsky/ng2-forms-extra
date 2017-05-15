import { AbstractControl, ValidationErrors, Validator } from "@angular/forms";
export declare class NonBlankDirective implements Validator {
    private _required;
    private _onChange;
    nonBlank: boolean;
    validate(c: AbstractControl): ValidationErrors | null;
    registerOnValidatorChange(fn: () => void): void;
}
