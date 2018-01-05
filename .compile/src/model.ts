import {EventEmitter} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {InputStatus, InputReady} from "./input-status";

/**
 * Submittable interface.
 *
 * Submittables (e.g. form inputs) could be submitted at once via {{SubmitService}}.
 *
 * Submittable is responsible for its input status indication and updates.
 */
export abstract class Submittable {

    /**
     * Current input status of this submittable.
     */
    abstract readonly inputStatus: InputStatus;

    /**
     * Input status changes event emitter.
     */
    abstract readonly inputStatusChange: EventEmitter<InputStatus>;

    /**
     * Whether this submittable is ready to be submitted.
     *
     * @return {boolean} the value of `.inputStatus.ready` field.
     */
    get ready(): boolean {
        return this.inputStatus.ready;
    }

    /**
     * An errors associated with this submittable.
     *
     * @return {{}|undefined} the value of `.inputStatus.errors` field.
     */
    get errors(): {[key: string]: any} | undefined {
        return this.inputStatus.errors;
    }

    /**
     * Updates input status.
     *
     * @param emitEvents whether to emit input status change events. `true` by default.
     */
    abstract updateInputStatus({emitEvents}?: {emitEvents?: boolean}): InputStatus;

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
export class Registry<T> {

    readonly changes = new EventEmitter<T[]>();
    private _map: {[id: string]: T} = {};
    private _list?: T[];
    private _idSeq = 0;

    get list(): T[] {
        if (this._list) {
            return this._list;
        }

        const list: T[] = [];

        for (let id in this._map) {
            if (this._map.hasOwnProperty(id)) {
                list.push(this._map[id]);
            }
        }

        return this._list = list;
    }

    add(item: T, handle?: RegistryHandle | (() => void)): RegistryHandle {

        const unregister = !handle ? (() => {}) : typeof handle === "function" ? handle : (() => handle.unregister());
        const id = "" + ++this._idSeq;
        const self = this;

        this._map[id] = item;
        this._list = undefined;
        this.changes.emit(this.list);

        return {
            unregister() {
                delete self._map[id];
                self._list = undefined;
                self.changes.emit(self.list);
                unregister();
            }
        }
    }

}

const resolved = Promise.resolve();

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
export abstract class SubmitGroup extends Submittable {

    readonly inputStatusChange = new EventEmitter<InputStatus>();
    private _registry = new Registry<Submittable>();
    private _inputStatus = InputReady;

    constructor() {
        super();
    }

    get inputStatus(): InputStatus {
        return this._inputStatus;
    }

    /**
     * An event emitter reporting on submittable list changes, i.e. submittable additions or removals.
     *
     * @return {EventEmitter<Submittable[]>}
     */
    get submittableChanges(): EventEmitter<Submittable[]> {
        return this._registry.changes;
    }

    /**
     * Submittables added to this group.
     *
     * @return {Submittable[]} an array of submittables.
     */
    get submittables(): Submittable[] {
        return this._registry.list;
    }

    updateInputStatus({emitEvents = true}: {emitEvents?: boolean} = {}): InputStatus {

        const status = this.submittables.reduce(
            (combined, s) => combined.merge(s.updateInputStatus({emitEvents: false})),
            InputReady);

        this.setInputStatus(status, {emitEvents});

        return status;
    }

    protected setInputStatus(status: InputStatus, {emitEvents = true}: {emitEvents?: boolean} = {}) {
        if (this._inputStatus.equals(status)) {
            return;
        }
        this._inputStatus = status;
        if (emitEvents !== false) {
            this.inputStatusChange.emit(status);
        }
    }

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
    addSubmittable(submittable: Submittable): RegistryHandle {

        let subscr: Subscription;
        const reg = this.registerSubmittable(submittable);
        const handle = this._registry.add(submittable, () => {
            subscr && subscr.unsubscribe();
            try {
                reg.unregister();
            } finally {
                this.updateInputStatus();
            }
        });

        this.updateInputStatus();
        subscr = submittable.inputStatusChange.subscribe(() => resolved.then(() => this.updateInputStatus()));

        return handle;
    }

    protected registerSubmittable(_submittable: Submittable): RegistryHandle {
        return {
            unregister() {}
        }
    }

}

/**
 * Input service.
 *
 * An input service is registered by {{InputDirective}} to group one or more input fields.
 */
export abstract class InputService extends SubmitGroup {
}

/**
 * Submit service.
 *
 * A submit service is registered alongside Angular forms by {{SubmitReadyDirective}}. The input fields are added
 * to this service automatically (either directly, or by {{InputService}}). It can be used to submit such forms when
 * they are ready.
 */
export abstract class SubmitService extends SubmitGroup {

    /**
     * Emits an event on attempt to submit.
     */
    abstract readonly preSubmit: EventEmitter<any>;

    /**
     * Emits an event on attempt to submit and all inputs are ready to be submitted.
     */
    abstract readonly submitReady: EventEmitter<any>;

    protected _submitted = false;

    /**
     * Whether an attempt to submit this form were performed.
     *
     * @return {boolean} `true` if `.submit()` method is called.
     */
    get submitted(): boolean {
        return this._submitted;
    }

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
    resetSubmitted(): void {
        this._submitted = false;
    }

}
