import { OnInit, OnDestroy, EventEmitter } from "@angular/core";
import { NgControl, AbstractControl } from "@angular/forms";
import { Submittable, SubmitGroup, SubmitService, InputService, SubmittableControl } from "./model";
export declare class InputControlDirective implements SubmittableControl, OnInit, OnDestroy {
    private _inputService;
    private _submitGroup;
    private _submitService;
    private _control;
    readonly readyStateChanges: EventEmitter<boolean>;
    private _ready;
    private _regHandle?;
    private _preSubmitSubscr?;
    private _stateSubscr?;
    constructor(_inputService: InputService, _submitGroup: SubmitGroup<Submittable>, _submitService: SubmitService, _control: NgControl);
    readonly ready: boolean;
    readonly control: AbstractControl;
    updateReadyState({emitEvents}?: {
        emitEvents?: boolean;
    }): boolean;
    ngOnInit(): void;
    ngOnDestroy(): void;
}
