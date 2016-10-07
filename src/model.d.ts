import { EventEmitter } from "@angular/core";
import { AbstractControl } from "@angular/forms";
export interface Submittable {
    readonly ready: boolean;
    readonly readyStateChanges: EventEmitter<boolean>;
    updateReadyState(opts?: {
        emitEvents?: boolean;
    }): boolean;
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
export declare abstract class SubmitGroup<S extends Submittable> implements Submittable {
    readonly readyStateChanges: EventEmitter<boolean>;
    private _registry;
    private _ready;
    readonly ready: boolean;
    readonly submittableChanges: EventEmitter<S[]>;
    readonly submittables: S[];
    updateReadyState({emitEvents}?: {
        emitEvents?: boolean;
    }): boolean;
    protected setReadyState(ready: boolean, {emitEvents}?: {
        emitEvents?: boolean;
    }): void;
    addSubmittable(submittable: S): RegistryHandle;
    protected registerSubmittable(_submittable: S): RegistryHandle;
}
export interface SubmittableControl extends Submittable {
    readonly control: AbstractControl;
}
export declare abstract class InputService extends SubmitGroup<SubmittableControl> {
}
export declare abstract class SubmitService extends SubmitGroup<Submittable> {
    readonly abstract preSubmit: EventEmitter<any>;
    readonly abstract submitReady: EventEmitter<any>;
    protected _submitted: boolean;
    readonly submitted: boolean;
    abstract submit(): boolean;
    resetSubmitted(): void;
}
