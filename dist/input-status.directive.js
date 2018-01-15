import { Directive, HostBinding } from "@angular/core";
import { InputService } from "./model";
var InputStatusDirective = /** @class */ (function () {
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
        "invalid": [{ type: HostBinding, args: ["class.has-error",] },],
    };
    return InputStatusDirective;
}());
export { InputStatusDirective };
//# sourceMappingURL=C:/Users/info/Desktop/Projects/Smart Warehousing/ng2-forms-extra/src/input-status.directive.js.map