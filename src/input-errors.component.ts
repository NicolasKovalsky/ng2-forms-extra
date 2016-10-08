import {Component, Input, OnDestroy, Optional, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {InputService, SubmittableControl} from "./model";

export interface InputErrorMap {
    [key: string]: string | ((error: any, control: SubmittableControl) => string)
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

const resolved = Promise.resolve();

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
export class InputErrorsComponent implements OnInit, OnDestroy {

    private _subscription?: Subscription;
    private _errors: InputError[] = [];

    @Input()
    private inputErrorsMap: InputErrorMap = {};

    constructor(@Optional() private _inputService: InputService) {
    }

    get hasErrors(): boolean {
        return !this._inputService.inputStatus.ready && this.errors.length > 0;
    }

    get errors(): InputError[] {
        return this._errors;
    }

    ngOnInit() {
        this._subscription = this._inputService.submittableChanges.subscribe(
            (controls: SubmittableControl[]) => this.updateInputs(controls));
        this.updateInputs(this._inputService.submittables);
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
            delete this._subscription;
        }
    }

    private trackError(error: InputError) {
        return error.key;
    }

    private updateInputs(controls: SubmittableControl[]) {

        const updateErrors = () => resolved.then(() => {
            this._errors.splice(0);
            controls.forEach(submittable => {

                const errors = submittable.inputStatus.errors;

                if (errors) {
                    for (let key in errors) {
                        if (errors.hasOwnProperty(key)) {

                            const message = this.errorMessage(submittable, key, errors[key]);

                            if (message != null) {
                                this._errors.push({key, message});
                            }
                        }
                    }
                }
            });
        });

        controls.forEach(s => s.control.statusChanges.subscribe(updateErrors));
        updateErrors();
    }

    private errorMessage(control: SubmittableControl, key: string, value: any): string | undefined {
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

}

function errorMessage(
    control: SubmittableControl,
    value: any,
    message: undefined | string | ((value: any, control: SubmittableControl) => string)): string | undefined {
    if (message == null) {
        return undefined;
    }
    if (typeof message === "string") {
        return message;
    }
    return message(value, control);
}
