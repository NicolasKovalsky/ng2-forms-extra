var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Input, Optional } from "@angular/core";
import { SubmitGroup } from "./model";
var DEFAULT_INPUT_ERRORS_MAP = {
    required: "This field is required",
    minlength: function (error) {
        if (error && error.requiredLength > 0) {
            return "The value should be at least " + error.requiredLength + " characters long";
        }
        return "The value is too short";
    },
    maxlength: function (error) {
        if (error && error.requiredLength > 0) {
            return "The value should be at most " + error.requiredLength + " characters long";
        }
        return "The value is too long";
    },
};
var resolved = Promise.resolve();
var InputErrorsComponent = (function () {
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
        var updateErrors = function () { return resolved.then(function () {
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
        }); };
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
    return InputErrorsComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], InputErrorsComponent.prototype, "inputErrorsMap", void 0);
InputErrorsComponent = __decorate([
    Component({
        selector: 'input-errors,[inputErrors],[inputErrorsMap]',
        template: "\n    <ng-container *ngIf=\"hasErrors\">\n        <p *ngFor=\"let error of errors; trackBy: trackError\" class=\"text-danger\">{{error.message}}</p>\n        </ng-container>\n    ",
        host: {
            '[class.frex-errors]': 'true',
            '[class.frex-no-errors]': '!hasErrors',
        }
    }),
    __param(0, Optional()),
    __metadata("design:paramtypes", [SubmitGroup])
], InputErrorsComponent);
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
