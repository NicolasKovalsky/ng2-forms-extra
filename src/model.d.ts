import { EventEmitter } from "@angular/core";
import { InputStatus } from "./input-status";
/**
 * Submittable interface.
 *
 * Submittables (e.g. form inputs) could be submitted at once via {{SubmitService}}.
 *
 * Submittable is responsible for its input status indication and updates.
 */
export declare abstract class Submittable {
    /**
     * Current input status of this submittable.
     */
    readonly abstract inputStatus: InputStatus;
    /**
     * Input status changes event emitter.
     */
    readonly abstract inputStatusChange: EventEmitter<InputStatus>;
    /**
     * Whether this submittable is ready to be submitted.
     *
     * @return {boolean} the value of `.inputStatus.ready` field.
     */
    readonly ready: boolean;
    /**
     * An errors associated with this submittable.
     *
     * @return {{}|undefined} the value of `.inputStatus.errors` field.
     */
    readonly errors: {
        [key: string]: any;
    } | undefined;
    /**
     * Updates input status.
     *
     * @param emitEvents whether to emit input status change events. `true` by default.
     */
    abstract updateInputStatus({emitEvents}?: {
        emitEvents?: boolean;
    }): InputStatus;
}
/**
 * A registry handle, that can be used to unregister previously registered entity.
 *
 * An instance of this class is typically returned form registration methods and can be used to revert their effect.
 */
export interface RegistryHandle {
    /**
     * Unregisters the entity that were registered by the method call returned this handle instance.
     *
     * Subsequent calls to this method won't have any effect.
     */
    unregister(): void;
}
/**
 * A utility registry implementation.
 */
export declare class Registry<T> {
    readonly changes: EventEmitter<T[]>;
    private _map;
    private _list?;
    private _idSeq;
    readonly list: T[];
    add(item: T, handle?: RegistryHandle | (() => void)): RegistryHandle;
}
/**
 * A group of submittables represented as one submittable.
 *
 * The submittables could be added to the group with `addSubmittable()` methods.
 *
 * The input status of this group is combined from the added submittables' input statuses with `InputStatus.merge()`
 * method.
 *
 * This is a base class for concrete injectable service implementations. It is also used as a provider token.
 */
export declare abstract class SubmitGroup extends Submittable {
    readonly inputStatusChange: EventEmitter<InputStatus>;
    private _registry;
    private _inputStatus;
    constructor();
    readonly inputStatus: InputStatus;
    /**
     * An event emitter reporting on submittable list changes, i.e. submittable additions or removals.
     *
     * @return {EventEmitter<Submittable[]>}
     */
    readonly submittableChanges: EventEmitter<Submittable[]>;
    /**
     * Submittables added to this group.
     *
     * @return {Submittable[]} an array of submittables.
     */
    readonly submittables: Submittable[];
    updateInputStatus({emitEvents}?: {
        emitEvents?: boolean;
    }): InputStatus;
    protected setInputStatus(status: InputStatus, {emitEvents}?: {
        emitEvents?: boolean;
    }): void;
    /**
     * Adds submittable to this group.
     *
     * The addition would be reported by `submittableChanges` event emitter.
     *
     * @param submittable a submittable to add.
     *
     * @return {RegistryHandle} a handle that can be used to remove the `submittable` from this group. The removal
     * would be reported by `submittableChanges` event emitter.
     */
    addSubmittable(submittable: Submittable): RegistryHandle;
    protected registerSubmittable(_submittable: Submittable): RegistryHandle;
}
/**
 * Input service.
 *
 * An input service is registered by {{InputDirective}} to group one or more input fields.
 */
export declare abstract class InputService extends SubmitGroup {
}
/**
 * Submit service.
 *
 * A submit service is registered alongside Angular forms by {{SubmitReadyDirective}}. The input fields are added
 * to this service automatically (either directly, or by {{InputService}}). It can be used to submit such forms when
 * they are ready.
 */
export declare abstract class SubmitService extends SubmitGroup {
    /**
     * Emits an event on attempt to submit.
     */
    readonly abstract preSubmit: EventEmitter<any>;
    /**
     * Emits an event on attempt to submit and all inputs are ready to be submitted.
     */
    readonly abstract submitReady: EventEmitter<any>;
    protected _submitted: boolean;
    /**
     * Whether an attempt to submit this form were performed.
     *
     * @return {boolean} `true` if `.submit()` method is called.
     */
    readonly submitted: boolean;
    /**
     * Attempts to submit a form.
     *
     * - Sets `.submitted` flag.
     * - Emits `.preSubmit` event.
     * - Updates input statuses of all registered submittables with `Submittable.updateInputStatus()`
     * - If ALL submittables are ready to be submitted, emits a `.submitReady` event.
     */
    abstract submit(): boolean;
    /**
     * Resets a submitted flag.
     */
    resetSubmitted(): void;
}
