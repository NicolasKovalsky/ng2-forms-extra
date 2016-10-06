import {EventEmitter} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {ReadyForSubmit} from "./model";

export abstract class InputService implements ReadyForSubmit {

    readonly controlChanges = new EventEmitter<AbstractControl[]>();

    abstract readonly controls: AbstractControl[];

    readonly readyStateChanges = new EventEmitter<boolean>();

    abstract readonly ready: boolean;

    abstract updateReadyState(opts?: {emitEvents?: boolean}): boolean;

}
