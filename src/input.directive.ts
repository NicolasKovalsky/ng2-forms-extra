import {Directive, OnDestroy, OnInit, forwardRef} from "@angular/core";
import {Subscription} from "rxjs";
import {RegistryHandle, InputService, SubmitService, SubmitGroup} from "./model";

@Directive({
    selector: '[inputStatus]',
    exportAs: "frexInput",
    providers: [
        {
            provide: InputService,
            useExisting: forwardRef(() => InputDirective),
        },
        {
            provide: SubmitGroup,
            useExisting: InputService,
        },
    ]
})
export class InputDirective extends InputService implements OnInit, OnDestroy {

    private _regHandle?: RegistryHandle;
    private _preSubmitSubscr?: Subscription;

    constructor(private _submitService: SubmitService) {
        super();
    }

    ngOnInit() {
        this._regHandle = this._submitService.addSubmittable(this);
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(() => this.updateReadyState());
    }

    ngOnDestroy() {
        if (this._regHandle) {
            this._regHandle.unregister();
            delete this._regHandle;
        }
        if (this._preSubmitSubscr) {
            this._preSubmitSubscr.unsubscribe();
            delete this._preSubmitSubscr;
        }
    }

}
