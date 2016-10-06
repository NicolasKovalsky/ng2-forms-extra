import {
    Directive,
    Input,
    AfterViewInit,
    OnDestroy,
    QueryList,
    ContentChildren,
    AfterContentInit,
    OnInit,
    forwardRef
} from "@angular/core";
import {AbstractControl, AbstractControlDirective, NgControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {InputService} from "./input.service";
import {SubmitService} from "./submit.service";
import {RegistryHandle} from "./model";

const resolved = Promise.resolve();

interface InputStatus {
    invalid: boolean;
    dirty: boolean;
    touched: boolean;
}

@Directive({
    selector: '[inputStatus]',
    exportAs: "frexInput",
    providers: [{
        provide: InputService,
        useExisting: forwardRef(() => InputDirective),
    }]
})
export class InputDirective extends InputService implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    @ContentChildren(NgControl)
    private _inputs: QueryList<AbstractControlDirective>;
    private _controls: AbstractControl[] = [];
    private _input: AbstractControl;
    private _contentSubscr?: Subscription;
    private _readyHandle?: RegistryHandle;
    private _preSubmitSubscr?: Subscription;
    private _controlsSubscr?: Subscription;
    private _ready = true;
    private _status: InputStatus = {
        invalid: false,
        dirty: false,
        touched: false,
    };

    constructor(private _submitService: SubmitService) {
        super();
    }

    @Input()
    set inputStatus(input: AbstractControl) {
        if (this._input === input) {
            return;
        }
        this._input = input;
        this.unsubscribe();
        this.subscribe();
    }

    get controls(): AbstractControl[] {
        return this._controls;
    }

    set controls(controls: AbstractControl[]) {
        this._controls = controls;
        this.controlChanges.emit(this._controls);
        this._controls.forEach(control => control.updateValueAndValidity())
    }

    get ready(): boolean {
        return this._ready;
    }

    ngAfterViewInit() {
        this.subscribe();
    }

    ngAfterContentInit() {
        if (!this._contentSubscr) {
            this.subscribe();
        }
    }

    ngOnInit() {
        this._readyHandle = this._submitService.addReadyForSubmit(this);
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(() => this.updateReadyState());
        this._controlsSubscr = this.controlChanges.subscribe((controls: AbstractControl[]) => {

            const statuses = new Array<InputStatus>(controls.length);

            controls.forEach((control, index) => {

                const updateControlStatus = () => resolved.then(() => {
                    statuses[index] = {
                        invalid: !!control.invalid,
                        dirty: !!control.dirty,
                        touched: !!control.touched,
                    };
                    this.updateStatus(statuses);
                });

                control.statusChanges.subscribe(updateControlStatus);
                updateControlStatus();
            });
        });
    }

    updateReadyState({emitEvents = true}: {emitEvents?: boolean} = {}): boolean {

        const ready = !(this._status.invalid && (this._status.dirty || this._submitService.submitted));

        if (ready !== this._ready) {
            this._ready = ready;
            if (emitEvents !== false) {
                this.readyStateChanges.emit(ready);
            }
        }

        return ready;
    }

    private updateStatus(statuses: InputStatus[]) {

        const newStatus = {
            invalid: false,
            dirty: false,
            touched: false,
        };

        statuses.forEach(
            status => {
                newStatus.invalid = newStatus.invalid || status.invalid;
                newStatus.dirty = newStatus.dirty || status.dirty;
                newStatus.touched = newStatus.touched || status.touched;
            });

        this._status = newStatus;
        this.updateReadyState();
    }

    ngOnDestroy() {
        if (this._readyHandle) {
            this._readyHandle.unregister();
            delete this._readyHandle;
        }
        if (this._preSubmitSubscr) {
            this._preSubmitSubscr.unsubscribe();
            delete this._preSubmitSubscr;
        }
        if (this._controlsSubscr) {
            this._controlsSubscr.unsubscribe();
            delete this._controlsSubscr;
        }
        this.unsubscribe();
    }

    private subscribe() {
        if (this._input) {
            this.controls = [this._input];
        } else if (this._inputs) {
            this._contentSubscr = this._inputs.changes.subscribe(() => this.updateInputs());
            this.updateInputs();
        }
    }

    private updateInputs() {
        this.controls = this._inputs.map(ctr => ctr.control);
    }

    private unsubscribe() {
        if (this._contentSubscr) {
            this._contentSubscr.unsubscribe();
            this._contentSubscr = undefined;
        }
        this.controls = [];
    }

}
