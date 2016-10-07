import {Directive, HostListener, Output, EventEmitter, OnDestroy, forwardRef} from "@angular/core";
import {SubmitService, SubmitGroup} from "./model";

@Directive({
    selector: 'form:not([ngNoForm]),ngForm,[ngForm],[formGroup]',
    exportAs: "frexSubmit",
    providers: [
        {
            provide: SubmitService,
            useExisting: forwardRef(() => SubmitReadyDirective),
        },
        {
            provide: SubmitGroup,
            useExisting: SubmitService,
        },
    ]
})
export class SubmitReadyDirective extends SubmitService implements OnDestroy {

    @Output()
    readonly preSubmit = new EventEmitter<any>();

    @Output()
    readonly submitReady = new EventEmitter<any>();

    constructor() {
        super();
    }

    @HostListener('ngSubmit')
    onSubmit() {
        this.submit();
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
