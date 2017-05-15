import { NG_VALIDATORS, Validators } from "@angular/forms";
import { Directive, forwardRef, Input } from "@angular/core";
var NOOP = function () { };
var NonBlankDirective = (function () {
    function NonBlankDirective() {
        this._onChange = NOOP;
    }
    Object.defineProperty(NonBlankDirective.prototype, "nonBlank", {
        get: function () {
            return this._required;
        },
        set: function (value) {
            this._required = value != null && "" + value !== 'false';
            this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    NonBlankDirective.prototype.validate = function (c) {
        return this.nonBlank ? Validators.required(c) : null;
    };
    NonBlankDirective.prototype.registerOnValidatorChange = function (fn) {
        this._onChange = fn || NOOP;
    };
    return NonBlankDirective;
}());
export { NonBlankDirective };
NonBlankDirective.decorators = [
    { type: Directive, args: [{
                selector: '[nonBlank]',
                providers: [
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(function () { return NonBlankDirective; }),
                        multi: true,
                    }
                ],
            },] },
];
/** @nocollapse */
NonBlankDirective.ctorParameters = function () { return []; };
NonBlankDirective.propDecorators = {
    'nonBlank': [{ type: Input },],
};
//# sourceMappingURL=non-blank.directive.js.map