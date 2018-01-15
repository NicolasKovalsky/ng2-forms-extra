import { Component, Input, Optional } from "@angular/core";
import { SubmitGroup } from "./model";
var ɵ0 = function (error) {
    if (error && error.requiredLength > 0) {
        return "The value should be at least " + error.requiredLength + " characters long";
    }
    return "The value is too short";
}, ɵ1 = function (error) {
    if (error && error.requiredLength > 0) {
        return "The value should be at most " + error.requiredLength + " characters long";
    }
    return "The value is too long";
};
var DEFAULT_INPUT_ERRORS_MAP = {
    required: "This field is required",
    minlength: ɵ0,
    maxlength: ɵ1,
};
var resolved = Promise.resolve();
var InputErrorsComponent = /** @class */ (function () {
    function InputErrorsComponent(_submitGroup) {
        this._submitGroup = _submitGroup;
        this._errors = [];
        this.inputErrorsMap = {};
    }
    Object.defineProperty(InputErrorsComponent.prototype, "hasErrors", {
        get: function () {
            return !this._submitGroup.inputStatus.ready && this.errors.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputErrorsComponent.prototype, "errors", {
        get: function () {
            return this._errors;
        },
        enumerable: true,
        configurable: true
    });
    InputErrorsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._subscription = this._submitGroup.submittableChanges.subscribe(function (submittables) { return _this.updateSubmittables(submittables); });
        this.updateSubmittables(this._submitGroup.submittables);
    };
    InputErrorsComponent.prototype.ngOnDestroy = function () {
        if (this._subscription) {
            this._subscription.unsubscribe();
            delete this._subscription;
        }
    };
    InputErrorsComponent.prototype.trackError = function (error) {
        return error.key;
    };
    InputErrorsComponent.prototype.updateSubmittables = function (submittables) {
        var _this = this;
        var updateErrors = function () {
            return resolved.then(function () {
                _this._errors.splice(0);
                submittables.forEach(function (submittable) {
                    var errors = submittable.inputStatus.errors;
                    if (errors) {
                        for (var key in errors) {
                            if (errors.hasOwnProperty(key)) {
                                var message = _this.errorMessage(submittable, key, errors[key]);
                                if (message != null) {
                                    _this._errors.push({ key: key, message: message });
                                }
                            }
                        }
                    }
                });
            });
        };
        submittables.forEach(function (s) { return s.inputStatusChange.subscribe(updateErrors); });
        updateErrors();
    };
    InputErrorsComponent.prototype.errorMessage = function (control, key, value) {
        if (value == null) {
            return undefined;
        }
        var known = this.inputErrorsMap[key];
        if (known != null) {
            return errorMessage(control, value, known);
        }
        var defaultMsg = errorMessage(control, value, DEFAULT_INPUT_ERRORS_MAP[key]);
        if (defaultMsg != null) {
            return defaultMsg;
        }
        if (typeof value === "string") {
            return value;
        }
        return key;
    };
    InputErrorsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'input-errors,[inputErrors],[inputErrorsMap]',
                    template: "\n    <ng-container *ngIf=\"hasErrors\">\n        <p *ngFor=\"let error of errors; trackBy: trackError\" class=\"text-danger\">{{error.message}}</p>\n        </ng-container>\n    ",
                    host: {
                        '[class.frex-errors]': 'true',
                        '[class.frex-no-errors]': '!hasErrors',
                    }
                },] },
    ];
    /** @nocollapse */
    InputErrorsComponent.ctorParameters = function () { return [
        { type: SubmitGroup, decorators: [{ type: Optional },] },
    ]; };
    InputErrorsComponent.propDecorators = {
        "inputErrorsMap": [{ type: Input },],
    };
    return InputErrorsComponent;
}());
export { InputErrorsComponent };
function errorMessage(submittable, value, message) {
    if (message == null) {
        return undefined;
    }
    if (typeof message === "string") {
        return message;
    }
    return message(value, submittable);
}
export { ɵ0, ɵ1 };
//# sourceMappingURL=C:/Users/info/Desktop/Projects/Smart Warehousing/ng2-forms-extra/src/input-errors.component.js.map