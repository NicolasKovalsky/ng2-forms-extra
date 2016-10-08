import { EventEmitter, OnDestroy } from "@angular/core";
import { SubmitService } from "./model";
export declare class SubmitReadyDirective extends SubmitService implements OnDestroy {
    readonly preSubmit: EventEmitter<any>;
    readonly submitReady: EventEmitter<any>;
    constructor();
    onSubmit(): void;
    submit(): boolean;
    ngOnDestroy(): void;
}
