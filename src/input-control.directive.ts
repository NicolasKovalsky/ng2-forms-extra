import {Directive, Host, OnInit, OnDestroy, EventEmitter, Optional} from "@angular/core";
import {NgControl, AbstractControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {Submittable, SubmitGroup, RegistryHandle, SubmitService, InputService, SubmittableControl} from "./model";

@Directive({
    selector: '[ngModel],[formControl],[formControlName]'
})
export class InputControlDirective implements SubmittableControl, OnInit, OnDestroy {

    readonly readyStateChanges = new EventEmitter<boolean>();
    private _ready = true;
    private _regHandle?: RegistryHandle;
    private _preSubmitSubscr?: Subscription;
    private _stateSubscr?: Subscription;

    constructor(
        @Optional() private _inputService: InputService,
        private _submitGroup: SubmitGroup<Submittable>,
        private _submitService: SubmitService,
        @Host() private _control: NgControl) {
    }

    get ready(): boolean {
        return this._ready;
    }

    get control(): AbstractControl {
        return this._control.control;
    }

    updateReadyState({emitEvents = true}: {emitEvents?: boolean} = {}): boolean {

        const ready = !(this.control.invalid && (this.control.dirty || this._submitService.submitted));

        if (this._ready !== ready) {
            this._ready = ready;
            if (emitEvents !== false) {
                this.readyStateChanges.emit(ready);
            }
        }

        return ready;
    }

    ngOnInit() {
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(() => this.updateReadyState());
        this._stateSubscr = this.control.statusChanges.subscribe(() => this.updateReadyState());
        this.updateReadyState({emitEvents: false});
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
