import {Directive, HostBinding} from "@angular/core";
import {InputService} from "./model";

@Directive({
    selector: '[inputStatus]',
})
export class InputStatusDirective {

    constructor(private _inputService: InputService) {
    }

    @HostBinding("class.frex-invalid")
    get invalid(): boolean {
        return !this._inputService.inputStatus.ready;
    }

}
