import { OnDestroy, AfterViewInit, OnInit } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { InputService } from "./input.service";
export interface InputErrorMap {
    [key: string]: string | ((error: any, control: AbstractControl) => string);
}
export interface InputError {
    key: string;
    message: string;
}
export declare class InputErrorsComponent implements OnInit, AfterViewInit, OnDestroy {
    private _inputService;
    private _input;
    private _subscription?;
    private _errors;
    private inputErrorsMap;
    constructor(_inputService: InputService);
    inputErrors: AbstractControl;
    readonly hasErrors: boolean;
    readonly errors: InputError[];
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private trackError(error);
    private subscribe();
    private updateInputs(controls);
    private errorMessage(control, key, value);
    private unsubscribe();
}
