import { NG_VALIDATORS, Validators } from "@angular/forms";
import { Directive, forwardRef, Input } from "@angular/core";
var NOOP = function () { };
var ɵ0 = NOOP;
var NonBlankDirective = /** @class */ (function () {
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
        "nonBlank": [{ type: Input },],
    };
    return NonBlankDirective;
}());
export { NonBlankDirective };
export { ɵ0 };
//# sourceMappingURL=C:/Users/info/Desktop/Projects/Smart Warehousing/ng2-forms-extra/src/non-blank.directive.js.map