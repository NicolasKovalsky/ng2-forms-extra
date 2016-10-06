import { InputService } from "./input.service";
export declare class InputStatusDirective {
    private _inputService;
    constructor(_inputService: InputService);
    readonly invalid: boolean;
}
