import { Directive, Input, forwardRef, Injector } from "@angular/core";
import { AbstractControlDirective, NgControl, NG_VALIDATORS } from "@angular/forms";
var VALID = (null);
var NOOP = function () { };
var ɵ0 = NOOP;
var RepeatOfDirective = /** @class */ (function () {
    function RepeatOfDirective(_injector) {
        this._injector = _injector;
        this._onChange = NOOP;
    }
    Object.defineProperty(RepeatOfDirective.prototype, "repeatOf", {
        set: function (value) {
            this._repeatOf = value;
            this.unsubscribe();
            this.subscribe();
            this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    RepeatOfDirective.prototype.validate = function (control) {
        if (!this._repeatOf) {
            return VALID;
        }
        if (control.value == null || control.value === "") {
            return VALID;
        }
        if (control.value == this._repeatOf.value) {
            return VALID;
        }
        return { "repeat": "Values don't match" };
    };
    RepeatOfDirective.prototype.registerOnValidatorChange = function (fn) {
        this._onChange = fn || NOOP;
    };
    RepeatOfDirective.prototype.ngOnDestroy = function () {
        this.unsubscribe();
    };
    RepeatOfDirective.prototype.subscribe = function () {
        if (!this._repeatOf) {
            return;
        }
        var control = this._injector.get(NgControl).control;
        var repeatOfControl = this._repeatOf.control;
        if (control && repeatOfControl) {
            this._repeatOfSubscr = repeatOfControl.valueChanges.subscribe(function (value) { return control.updateValueAndValidity(); });
        }
    };
    RepeatOfDirective.prototype.unsubscribe = function () {
        if (this._repeatOfSubscr) {
            this._repeatOfSubscr.unsubscribe();
            this._repeatOfSubscr = undefined;
        }
    };
    RepeatOfDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[repeatOf]',
                    providers: [
                        {
                            provide: NG_VALIDATORS,
                            useExisting: forwardRef(function () { return RepeatOfDirective; }),
                            multi: true,
                        }
                    ],
                },] },
    ];
    /** @nocollapse */
    RepeatOfDirective.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    RepeatOfDirective.propDecorators = {
        "repeatOf": [{ type: Input },],
    };
    return RepeatOfDirective;
}());
export { RepeatOfDirective };
export { ɵ0 };
//# sourceMappingURL=C:/Users/info/Desktop/Projects/Smart Warehousing/ng2-forms-extra/src/repeat-of.directive.js.map