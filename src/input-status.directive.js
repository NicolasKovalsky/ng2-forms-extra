import { Directive, HostBinding } from "@angular/core";
import { InputService } from "./model";
var InputStatusDirective = (function () {
    function InputStatusDirective(_inputService) {
        this._inputService = _inputService;
    }
    Object.defineProperty(InputStatusDirective.prototype, "invalid", {
        get: function () {
            return !this._inputService.inputStatus.ready;
        },
        enumerable: true,
        configurable: true
    });
    return InputStatusDirective;
}());
export { InputStatusDirective };
InputStatusDirective.decorators = [
    { type: Directive, args: [{
                selector: '[inputStatus]',
            },] },
];
/** @nocollapse */
InputStatusDirective.ctorParameters = function () { return [
    { type: InputService, },
]; };
InputStatusDirective.propDecorators = {
    'invalid': [{ type: HostBinding, args: ["class.frex-invalid",] },],
};
//# sourceMappingURL=input-status.directive.js.map