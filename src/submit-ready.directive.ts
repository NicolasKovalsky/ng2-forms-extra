import {Directive, HostListener, Output, EventEmitter, Host, OnDestroy, forwardRef} from "@angular/core";
import {ControlContainer} from "@angular/forms";
import {SubmitService} from "./submit.service";
import {ReadyForSubmit, RegistryHandle} from "./model";

const resolved = Promise.resolve();

@Directive({
    selector: 'form:not([ngNoForm]),ngForm,[ngForm],[formGroup]',
    exportAs: "frexSubmit",
    providers: [
        {
            provide: SubmitService,
            useExisting: forwardRef(() => SubmitReadyDirective),
        },
    ]
})
export class SubmitReadyDirective extends SubmitService implements OnDestroy {

    @Output()
    readonly readyStateChanges = new EventEmitter<boolean>();

    @Output()
    readonly preSubmit = new EventEmitter<any>();

    @Output()
    readonly submitReady = new EventEmitter<any>();

    private _ready = true;
    private _idSeq = 0;
    private _readyForSubmit: {[id: string]: ReadyForSubmit} = {};

    constructor() {
        super();
    }

    get ready(): boolean {
        return this._ready;
    }

    @HostListener('ngSubmit')
    onSubmit() {
        this.submit();
    }

    addReadyForSubmit(ready: ReadyForSubmit): RegistryHandle {

        const id = "" + ++this._idSeq;

        this._readyForSubmit[id] = ready;

        const subscr = ready.readyStateChanges.subscribe((ready: boolean) => {
            if (!ready) {
                resolved.then(() => this.setReadyState(false));
            } else {
                resolved.then(() => this.updateReadyState());
            }
        });

        return {
            unregister: () => {
                delete this._readyForSubmit[id];
                subscr.unsubscribe();
            }
        };
    }

    updateReadyState({emitEvents = true}: {emitEvents?: boolean} = {}): boolean {

        let ready = true;

        for (let id in this._readyForSubmit) {
            if (this._readyForSubmit.hasOwnProperty(id)) {
                if (!this._readyForSubmit[id].updateReadyState({emitEvents})) {
                    ready = false;
                    break;
                }
            }
        }

        this.setReadyState(ready, {emitEvents});

        return ready;
    }

    private setReadyState(ready: boolean, {emitEvents = true}: {emitEvents?: boolean} = {}) {
        if (this._ready === ready) {
            return;
        }
        this._ready = ready;
        if (emitEvents !== false) {
            this.readyStateChanges.emit(ready);
        }
    }

    submit(): boolean {
        this._submitted = true;
        this.preSubmit.emit(null);
        if (!this.updateReadyState({emitEvents: false})) {
            return false;
        }
        this.submitReady.emit(null);
        return true;
    }

    ngOnDestroy() {
        this.submitReady.complete();
    }

}
