import {Directive, Input, OnDestroy, forwardRef, Injector} from "@angular/core";
import {AbstractControlDirective, NgControl, Validator, AbstractControl, NG_VALIDATORS} from "@angular/forms";
import {Subscription} from "rxjs";

const VALID: {} = null!;
const NOOP = () => {};

@Directive({
    selector: '[repeatOf]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RepeatOfDirective),
            multi: true,
        }
    ],
})
export class RepeatOfDirective implements Validator, OnDestroy {

    private _repeatOf?: AbstractControlDirective;
    private _repeatOfSubscr?: Subscription;
    private _onChange: () => void = NOOP;

    constructor(private _injector: Injector) {
    }

    @Input()
    set repeatOf(value: AbstractControlDirective) {
        this._repeatOf = value;
        this.unsubscribe();
        this.subscribe();
        this._onChange();
    }

    validate(control: AbstractControl): {} {
        if (!this._repeatOf) {
            return VALID;
        }
        if (control.value == null || control.value === "") {
            return VALID;
        }
        if (control.value == this._repeatOf.value) {
            return VALID;
        }
        return {"repeat": "Values don't match"};
    }

    registerOnValidatorChange(fn: () => void): void {
        this._onChange = fn || NOOP;
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    private subscribe() {
        if (!this._repeatOf) {
            return;
        }

        const control = this._injector.get(NgControl).control;
        const repeatOfControl = this._repeatOf.control;

        if (control && repeatOfControl) {
            this._repeatOfSubscr = repeatOfControl.valueChanges.subscribe(
                value => control.updateValueAndValidity());
        }
    }

    private unsubscribe() {
        if (this._repeatOfSubscr) {
            this._repeatOfSubscr.unsubscribe();
            this._repeatOfSubscr = undefined;
        }
    }

}
