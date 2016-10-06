import { EventEmitter } from "@angular/core";
import { ReadyForSubmit, RegistryHandle } from "./model";
export declare abstract class SubmitService implements ReadyForSubmit {
    readonly abstract readyStateChanges: EventEmitter<boolean>;
    readonly abstract preSubmit: EventEmitter<any>;
    readonly abstract submitReady: EventEmitter<any>;
    protected _submitted: boolean;
    readonly abstract ready: boolean;
    readonly submitted: boolean;
    abstract submit(): boolean;
    resetSubmitted(): void;
    abstract addReadyForSubmit(ready: ReadyForSubmit): RegistryHandle;
    abstract updateReadyState(opts?: {
        emitEvents?: boolean;
    }): boolean;
}
