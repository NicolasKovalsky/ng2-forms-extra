import { OnInit, OnDestroy, EventEmitter } from "@angular/core";
import { NgControl, AbstractControl } from "@angular/forms";
import { Submittable, SubmitGroup, SubmitService } from "./model";
import { InputStatus } from "./input-status";
export declare class InputControlDirective extends Submittable implements OnInit, OnDestroy {
    private _control;
    private _submitGroup;
    private _submitService;
    readonly inputStatusChange: EventEmitter<InputStatus>;
    private _inputStatus;
    private _regHandle?;
    private _preSubmitSubscr?;
    private _stateSubscr?;
    constructor(_control: NgControl, _submitGroup?: SubmitGroup, _submitService?: SubmitService);
    readonly inputStatus: InputStatus;
    readonly control: AbstractControl;
    updateInputStatus({emitEvents}?: {
        emitEvents?: boolean;
    }): InputStatus;
    private addReadiness(status);
    private addErrors(status);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
