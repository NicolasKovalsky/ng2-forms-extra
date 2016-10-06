import { AfterViewInit, OnDestroy, AfterContentInit, OnInit } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { InputService } from "./input.service";
import { SubmitService } from "./submit.service";
export declare class InputDirective extends InputService implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
    private _submitService;
    private _inputs;
    private _controls;
    private _input;
    private _contentSubscr?;
    private _readyHandle?;
    private _preSubmitSubscr?;
    private _controlsSubscr?;
    private _ready;
    private _status;
    constructor(_submitService: SubmitService);
    inputStatus: AbstractControl;
    controls: AbstractControl[];
    readonly ready: boolean;
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    ngOnInit(): void;
    updateReadyState({emitEvents}?: {
        emitEvents?: boolean;
    }): boolean;
    private updateStatus(statuses);
    ngOnDestroy(): void;
    private subscribe();
    private updateInputs();
    private unsubscribe();
}
