import { EventEmitter } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { ReadyForSubmit } from "./model";
export declare abstract class InputService implements ReadyForSubmit {
    readonly controlChanges: EventEmitter<AbstractControl[]>;
    readonly abstract controls: AbstractControl[];
    readonly readyStateChanges: EventEmitter<boolean>;
    readonly abstract ready: boolean;
    abstract updateReadyState(opts?: {
        emitEvents?: boolean;
    }): boolean;
}
