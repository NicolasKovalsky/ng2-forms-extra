import { EventEmitter } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { InputStatus } from "./input-status";
export declare abstract class Submittable {
    readonly abstract inputStatus: InputStatus;
    readonly abstract inputStatusChange: EventEmitter<InputStatus>;
    readonly ready: boolean;
    readonly errors: {
        [key: string]: any;
    } | undefined;
    abstract updateInputStatus(opts?: {
        emitEvents?: boolean;
    }): InputStatus;
}
export interface RegistryHandle {
    unregister(): void;
}
export declare class Registry<T> {
    readonly changes: EventEmitter<T[]>;
    private _map;
    private _list?;
    private _idSeq;
    readonly list: T[];
    add(item: T, handle?: RegistryHandle | (() => void)): RegistryHandle;
}
export declare abstract class SubmitGroup extends Submittable {
    readonly inputStatusChange: EventEmitter<InputStatus>;
    private _registry;
    private _inputStatus;
    constructor();
    readonly inputStatus: InputStatus;
    readonly submittableChanges: EventEmitter<Submittable[]>;
    readonly submittables: Submittable[];
    updateInputStatus({emitEvents}?: {
        emitEvents?: boolean;
    }): InputStatus;
    protected setInputStatus(status: InputStatus, {emitEvents}?: {
        emitEvents?: boolean;
    }): void;
    addSubmittable(submittable: Submittable): RegistryHandle;
    protected registerSubmittable(_submittable: Submittable): RegistryHandle;
}
export declare abstract class SubmittableControl extends Submittable {
    readonly abstract control: AbstractControl;
}
export declare abstract class InputService extends SubmitGroup {
}
export declare abstract class SubmitService extends SubmitGroup {
    readonly abstract preSubmit: EventEmitter<any>;
    readonly abstract submitReady: EventEmitter<any>;
    protected _submitted: boolean;
    readonly submitted: boolean;
    abstract submit(): boolean;
    resetSubmitted(): void;
}
