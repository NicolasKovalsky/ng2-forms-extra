import { OnInit, OnDestroy, EventEmitter } from "@angular/core";
import { NgControl, AbstractControl } from "@angular/forms";
import { Submittable, SubmitGroup, SubmitService, InputService, SubmittableControl } from "./model";
import { InputStatus } from "./input-status";
export declare class InputControlDirective extends SubmittableControl implements OnInit, OnDestroy {
    private _inputService;
    private _submitGroup;
    private _submitService;
    private _control;
    readonly inputStatusChange: EventEmitter<InputStatus>;
    private _inputStatus;
    private _regHandle?;
    private _preSubmitSubscr?;
    private _stateSubscr?;
    constructor(_inputService: InputService, _submitGroup: SubmitGroup<Submittable>, _submitService: SubmitService, _control: NgControl);
    readonly inputStatus: InputStatus;
    readonly control: AbstractControl;
    updateInputStatus({emitEvents}?: {
        emitEvents?: boolean;
    }): InputStatus;
    private inputReadiness();
    private addErrors(status);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
