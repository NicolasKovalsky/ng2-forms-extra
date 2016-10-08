import { OnDestroy, OnInit } from "@angular/core";
import { InputService, SubmittableControl } from "./model";
export interface InputErrorMap {
    [key: string]: string | ((error: any, control: SubmittableControl) => string);
}
export interface InputError {
    key: string;
    message: string;
}
export declare class InputErrorsComponent implements OnInit, OnDestroy {
    private _inputService;
    private _subscription?;
    private _errors;
    private inputErrorsMap;
    constructor(_inputService: InputService);
    readonly hasErrors: boolean;
    readonly errors: InputError[];
    ngOnInit(): void;
    ngOnDestroy(): void;
    private trackError(error);
    private updateInputs(controls);
    private errorMessage(control, key, value);
}
