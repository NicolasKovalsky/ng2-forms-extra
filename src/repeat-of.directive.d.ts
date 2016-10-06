import { OnDestroy, Injector } from "@angular/core";
import { AbstractControlDirective, Validator, AbstractControl } from "@angular/forms";
export declare class RepeatOfDirective implements Validator, OnDestroy {
    private _injector;
    private _repeatOf?;
    private _repeatOfSubscr?;
    private _onChange;
    constructor(_injector: Injector);
    repeatOf: AbstractControlDirective;
    validate(control: AbstractControl): {};
    registerOnValidatorChange(fn: () => void): void;
    ngOnDestroy(): void;
    private subscribe();
    private unsubscribe();
}
