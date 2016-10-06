import {NG_VALIDATORS, Validator, AbstractControl, Validators} from "@angular/forms";
import {Directive, forwardRef, Input} from "@angular/core";

const VALID: {} = null!;
const NOOP = () => {};

@Directive({
    selector: '[nonBlank]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NonBlankDirective),
            multi: true,
        }
    ],
})
export class NonBlankDirective implements Validator {

    private _required: boolean;
    private _onChange: () => void = NOOP;

    get nonBlank(): boolean {
        return this._required;
    }

    @Input()
    set nonBlank(value: boolean) {
        this._required = value != null && `${value}` !== 'false';
        this._onChange();
    }

    validate(c: AbstractControl): {} {
        return this.nonBlank ? Validators.required(c) : VALID;
    }

    registerOnValidatorChange(fn: () => void): void {
        this._onChange = fn || NOOP;
    }

}
