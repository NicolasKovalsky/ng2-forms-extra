import { Validator, AbstractControl } from "@angular/forms";
export declare class NonBlankDirective implements Validator {
    private _required;
    private _onChange;
    nonBlank: boolean;
    validate(c: AbstractControl): {};
    registerOnValidatorChange(fn: () => void): void;
}
