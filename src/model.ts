import {EventEmitter} from "@angular/core";

export interface ReadyForSubmit {

    readonly ready: boolean;

    readonly readyStateChanges: EventEmitter<boolean>;

    updateReadyState(opts?: {emitEvents?: boolean}): boolean;

}

export interface RegistryHandle {

    unregister(): void;

}
