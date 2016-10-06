import { EventEmitter, OnDestroy } from "@angular/core";
import { SubmitService } from "./submit.service";
import { ReadyForSubmit, RegistryHandle } from "./model";
export declare class SubmitReadyDirective extends SubmitService implements OnDestroy {
    readonly readyStateChanges: EventEmitter<boolean>;
    readonly preSubmit: EventEmitter<any>;
    readonly submitReady: EventEmitter<any>;
    private _ready;
    private _idSeq;
    private _readyForSubmit;
    constructor();
    readonly ready: boolean;
    onSubmit(): void;
    addReadyForSubmit(ready: ReadyForSubmit): RegistryHandle;
    updateReadyState({emitEvents}?: {
        emitEvents?: boolean;
    }): boolean;
    private setReadyState(ready, {emitEvents}?);
    submit(): boolean;
    ngOnDestroy(): void;
}
