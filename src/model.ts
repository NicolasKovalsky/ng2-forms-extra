import {EventEmitter} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {Subscription} from "rxjs";

export interface Submittable {

    readonly ready: boolean;

    readonly readyStateChanges: EventEmitter<boolean>;

    updateReadyState(opts?: {emitEvents?: boolean}): boolean;

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

export abstract class SubmitGroup<S extends Submittable> implements Submittable {

    readonly readyStateChanges = new EventEmitter<boolean>();
    private _registry = new Registry<S>();
    private _ready = true;

    get ready(): boolean {
        return this._ready;
    }

    get submittableChanges(): EventEmitter<S[]> {
        return this._registry.changes;
    }

    get submittables(): S[] {
        return this._registry.list;
    }

    updateReadyState({emitEvents = true}: {emitEvents?: boolean} = {}): boolean {

        const ready = !this.submittables.some(s => !s.updateReadyState({emitEvents: false}));

        this.setReadyState(ready, {emitEvents});

        return ready;
    }

    protected setReadyState(ready: boolean, {emitEvents = true}: {emitEvents?: boolean} = {}) {
        if (this._ready === ready) {
            return;
        }
        this._ready = ready;
        if (emitEvents !== false) {
            this.readyStateChanges.emit(ready);
        }
    }

    addSubmittable(submittable: S): RegistryHandle {

        let subscr: Subscription;
        const reg = this.registerSubmittable(submittable);
        const handle = this._registry.add(submittable, () => {
            subscr && subscr.unsubscribe();
            try {
                reg.unregister();
            } finally {
                this.updateReadyState();
            }
        });

        this.updateReadyState();
        subscr = submittable.readyStateChanges.subscribe((ready: boolean) => {
            if (!ready) {
                resolved.then(() => this.setReadyState(false));
            } else {
                resolved.then(() => this.updateReadyState());
            }
        });

        return handle;
    }

    protected registerSubmittable(_submittable: S): RegistryHandle {
        return {
            unregister() {}
        }
    }

}

export interface SubmittableControl extends Submittable {

    readonly control: AbstractControl;

}

export abstract class InputService extends SubmitGroup<SubmittableControl> {

}

export abstract class SubmitService extends SubmitGroup<Submittable> {

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
