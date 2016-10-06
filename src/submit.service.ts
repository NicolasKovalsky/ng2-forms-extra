import {EventEmitter} from "@angular/core";
import {ReadyForSubmit, RegistryHandle} from "./model";

export abstract class SubmitService implements ReadyForSubmit {

    abstract readonly readyStateChanges: EventEmitter<boolean>;
    abstract readonly preSubmit: EventEmitter<any>;
    abstract readonly submitReady: EventEmitter<any>;

    protected _submitted = false;

    abstract readonly ready: boolean;

    get submitted(): boolean {
        return this._submitted;
    }

    abstract submit(): boolean;

    resetSubmitted(): void {
        this._submitted = false;
    }

    abstract addReadyForSubmit(ready: ReadyForSubmit): RegistryHandle;

    abstract updateReadyState(opts?: {emitEvents?: boolean}): boolean;

}
