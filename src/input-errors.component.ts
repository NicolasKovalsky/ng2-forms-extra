import {Component, Input, OnDestroy, AfterViewInit, Optional, OnInit} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {InputService} from "./input.service";

export interface InputErrorMap {
    [key: string]: string | ((error: any, control: AbstractControl) => string)
}

const DEFAULT_INPUT_ERRORS_MAP: InputErrorMap = {
    required: "This field is required",
    minlength: (error: {requiredLength: number}) => {
        if (error && error.requiredLength > 0) {
            return "The value should be at least " + error.requiredLength + " characters long";
        }
        return "The value is too short";
    },
    maxlength: (error: {requiredLength: number}) => {
        if (error && error.requiredLength > 0) {
            return "The value should be at most " + error.requiredLength + " characters long";
        }
        return "The value is too long";
    },
};

export interface InputError {
    key: string;
    message: string;
}

@Component({
    selector: 'input-errors,[inputErrors],[inputErrorsMap]',
    template:
    `
    <ul class="frex-error-list" *ngIf="hasErrors">
        <li *ngFor="let error of errors; trackBy: trackError" class="frex-error">{{error.message}}</li>
    </ul>
    `,
    host: {
        '[class.frex-errors]': 'true',
        '[class.frex-errors-hidden]': '!hasErrors',
    }
})
export class InputErrorsComponent implements OnInit, AfterViewInit, OnDestroy {

    private _input: AbstractControl;
    private _subscription?: Subscription;
    private _errors: InputError[] = [];

    @Input()
    private inputErrorsMap: InputErrorMap = {};

    constructor(@Optional() private _inputService: InputService) {
    }

    @Input()
    set inputErrors(input: AbstractControl) {
        if (this._input === input) {
            return;
        }
        this._input = input;
        this.unsubscribe();
        this.subscribe();
    }

    get hasErrors(): boolean {
        return !this._inputService.ready && this.errors.length > 0;
    }

    get errors(): InputError[] {
        return this._errors;
    }

    ngOnInit() {
        if (!this._subscription) {
            this.subscribe();
        }
    }

    ngAfterViewInit() {
        if (!this._subscription) {
            this.subscribe();
        }
    }

    ngOnDestroy() {
        this.unsubscribe()
    }

    private trackError(error: InputError) {
        return error.key;
    }

    private subscribe() {
        if (this._input) {
            this._subscription = this._input.statusChanges.subscribe(
                () => this.updateInputs([this._input]));
        } else if (this._inputService) {
            this._subscription = this._inputService.controlChanges.subscribe(
                () => this.updateInputs(this._inputService.controls));
        }
    }

    private updateInputs(controls: AbstractControl[]) {

        const updateErrors = () => {
            this._errors.splice(0);
            controls.filter(control => !!control.errors).forEach(control => {

                const errors = control.errors;

                for (let key in errors) {
                    if (errors.hasOwnProperty(key)) {

                        const message = this.errorMessage(control, key, errors[key]);

                        if (message != null) {
                            this._errors.push({key, message});
                        }
                    }
                }
            });
        };

        controls.forEach(control => control.statusChanges.subscribe(updateErrors));
        updateErrors();
    }

    private errorMessage(control: AbstractControl, key: string, value: any): string | undefined {
        if (value == null) {
            return undefined;
        }

        const known = this.inputErrorsMap[key];

        if (known != null) {
            return errorMessage(control, value, known);
        }

        const defaultMsg = errorMessage(control, value, DEFAULT_INPUT_ERRORS_MAP[key]);

        if (defaultMsg != null) {
            return defaultMsg;
        }
        if (typeof value === "string") {
            return value;
        }

        return key;
    }

    private unsubscribe() {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = undefined;
        }
    }

}

function errorMessage(
    control: AbstractControl,
    value: any,
    message: undefined | string | ((value: any, control: AbstractControl) => string)): string | undefined {
    if (message == null) {
        return undefined;
    }
    if (typeof message === "string") {
        return message;
    }
    return message(value, control);
}
