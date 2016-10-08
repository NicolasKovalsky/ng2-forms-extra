import {Directive, Host, OnInit, OnDestroy, EventEmitter, Optional} from "@angular/core";
import {NgControl, AbstractControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {Submittable, SubmitGroup, RegistryHandle, SubmitService, InputService, SubmittableControl} from "./model";
import {InputStatus, InputErrors, InputReady, InputNotReady} from "./input-status";

@Directive({
    selector: '[ngModel],[formControl],[formControlName]'
})
export class InputControlDirective extends SubmittableControl implements OnInit, OnDestroy {

    readonly inputStatusChange = new EventEmitter<InputStatus>();
    private _inputStatus = InputReady;
    private _regHandle?: RegistryHandle;
    private _preSubmitSubscr?: Subscription;
    private _stateSubscr?: Subscription;

    constructor(
        @Optional() private _inputService: InputService,
        private _submitGroup: SubmitGroup<Submittable>,
        private _submitService: SubmitService,
        @Host() private _control: NgControl) {
        super();
    }

    get inputStatus(): InputStatus {
        return this._inputStatus;
    }

    get control(): AbstractControl {
        return this._control.control;
    }

    updateInputStatus({emitEvents = true}: {emitEvents?: boolean} = {}): InputStatus {

        let status = this.inputReadiness();

        status = this.addErrors(status);

        if (!status.equals(this._inputStatus)) {
            this._inputStatus = status;
            if (emitEvents !== false) {
                this.inputStatusChange.emit(status);
            }
        }

        return status;
    }

    private inputReadiness() {

        const ready = !(this.control.invalid && (this.control.dirty || this._submitService.submitted));

        return ready ? InputReady : InputNotReady;
    }

    private addErrors(status: InputStatus) {

        const errors = this.control.errors;

        if (errors) {
            return status.merge(new InputErrors(errors));
        }

        return status;
    }

    ngOnInit() {
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(() => this.updateInputStatus());
        this._stateSubscr = this.control.statusChanges.subscribe(() => this.updateInputStatus());
        this.updateInputStatus({emitEvents: false});
        this._regHandle =
            this._inputService ? this._inputService.addSubmittable(this) : this._submitGroup.addSubmittable(this);
    }

    ngOnDestroy() {
        if (this._regHandle) {
            this._regHandle.unregister();
            delete this._regHandle;
        }
        if (this._stateSubscr) {
            this._stateSubscr.unsubscribe();
            delete this._stateSubscr;
        }
        if (this._preSubmitSubscr) {
            this._preSubmitSubscr.unsubscribe();
            delete this._preSubmitSubscr;
        }
    }

}
