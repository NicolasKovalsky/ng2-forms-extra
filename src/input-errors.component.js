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
import { AbstractControl } from "@angular/forms";
import { InputService } from "./input.service";
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
export var InputErrorsComponent = (function () {
    function InputErrorsComponent(_inputService) {
        this._inputService = _inputService;
        this._errors = [];
        this.inputErrorsMap = {};
    }
    Object.defineProperty(InputErrorsComponent.prototype, "inputErrors", {
        set: function (input) {
            if (this._input === input) {
                return;
            }
            this._input = input;
            this.unsubscribe();
            this.subscribe();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputErrorsComponent.prototype, "hasErrors", {
        get: function () {
            return !this._inputService.ready && this.errors.length > 0;
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
        if (!this._subscription) {
            this.subscribe();
        }
    };
    InputErrorsComponent.prototype.ngAfterViewInit = function () {
        if (!this._subscription) {
            this.subscribe();
        }
    };
    InputErrorsComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe();
    };
    InputErrorsComponent.prototype.trackError = function (error) {
        return error.key;
    };
    InputErrorsComponent.prototype.subscribe = function () {
        var _this = this;
        if (this._input) {
            this._subscription = this._input.statusChanges.subscribe(function () { return _this.updateInputs([_this._input]); });
        }
        else if (this._inputService) {
            this._subscription = this._inputService.controlChanges.subscribe(function () { return _this.updateInputs(_this._inputService.controls); });
        }
    };
    InputErrorsComponent.prototype.updateInputs = function (controls) {
        var _this = this;
        var updateErrors = function () {
            _this._errors.splice(0);
            controls.filter(function (control) { return !!control.errors; }).forEach(function (control) {
                var errors = control.errors;
                for (var key in errors) {
                    if (errors.hasOwnProperty(key)) {
                        var message = _this.errorMessage(control, key, errors[key]);
                        if (message != null) {
                            _this._errors.push({ key: key, message: message });
                        }
                    }
                }
            });
        };
        controls.forEach(function (control) { return control.statusChanges.subscribe(updateErrors); });
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
    InputErrorsComponent.prototype.unsubscribe = function () {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = undefined;
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], InputErrorsComponent.prototype, "inputErrorsMap", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', AbstractControl), 
        __metadata('design:paramtypes', [AbstractControl])
    ], InputErrorsComponent.prototype, "inputErrors", null);
    InputErrorsComponent = __decorate([
        Component({
            selector: 'input-errors,[inputErrors],[inputErrorsMap]',
            template: "\n    <ul class=\"frex-error-list\" *ngIf=\"hasErrors\">\n        <li *ngFor=\"let error of errors; trackBy: trackError\" class=\"frex-error\">{{error.message}}</li>\n    </ul>\n    ",
            host: {
                '[class.frex-errors]': 'true',
                '[class.frex-errors-hidden]': '!hasErrors',
            }
        }),
        __param(0, Optional()), 
        __metadata('design:paramtypes', [InputService])
    ], InputErrorsComponent);
    return InputErrorsComponent;
}());
function errorMessage(control, value, message) {
    if (message == null) {
        return undefined;
    }
    if (typeof message === "string") {
        return message;
    }
    return message(value, control);
}
//# sourceMappingURL=input-errors.component.js.map