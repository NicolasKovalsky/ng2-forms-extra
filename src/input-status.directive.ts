import { Directive, HostBinding } from "@angular/core";
import { InputService } from "./model";

@Directive({
    selector: '[inputStatus]',
})
export class InputStatusDirective {

    constructor(private _inputService: InputService) {
    }

    @HostBinding("class.has-error")
    get invalid(): boolean {
        return !this._inputService.inputStatus.ready;
    }


}
