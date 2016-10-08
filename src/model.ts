import {EventEmitter} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {InputStatus, InputReady} from "./input-status";

export abstract class Submittable {

    abstract readonly inputStatus: InputStatus;

    abstract readonly inputStatusChange: EventEmitter<InputStatus>;

    get ready(): boolean {
        return this.inputStatus.ready;
    }

    get errors(): {[key: string]: any} | undefined {
        return this.inputStatus.errors;
    }

    abstract updateInputStatus(opts?: {emitEvents?: boolean}): InputStatus;

}

export interface RegistryHandle {

    unregister(): void;

}

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

    get submittableChanges(): EventEmitter<Submittable[]> {
        return this._registry.changes;
    }

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

export abstract class SubmittableControl extends Submittable {

    abstract readonly control: AbstractControl;

}

export abstract class InputService extends SubmitGroup {
}

export abstract class SubmitService extends SubmitGroup {

    abstract readonly preSubmit: EventEmitter<any>;
    abstract readonly submitReady: EventEmitter<any>;

    protected _submitted = false;

    get submitted(): boolean {
        return this._submitted;
    }

    abstract submit(): boolean;

    resetSubmitted(): void {
        this._submitted = false;
    }

}
