import { OnDestroy, OnInit } from "@angular/core";
import { InputService, SubmitService } from "./model";
export declare class InputDirective extends InputService implements OnInit, OnDestroy {
    private _submitService;
    private _regHandle?;
    private _preSubmitSubscr?;
    constructor(_submitService: SubmitService);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
