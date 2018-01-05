var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { Directive, Host, EventEmitter, Optional } from "@angular/core";
import { NgControl } from "@angular/forms";
import { Submittable, SubmitGroup, SubmitService } from "./model";
import { InputReady, InputNotReady, inputErrors } from "./input-status";
import { inputStatusControl } from "./input-status";
var InputControlDirective = (function (_super) {
    __extends(InputControlDirective, _super);
    function InputControlDirective(_control, _submitGroup, _submitService) {
        var _this = _super.call(this) || this;
        _this._control = _control;
        _this._submitGroup = _submitGroup;
        _this._submitService = _submitService;
        _this.inputStatusChange = new EventEmitter();
        _this._inputStatus = InputReady;
        return _this;
    }
    Object.defineProperty(InputControlDirective.prototype, "inputStatus", {
        get: function () {
            return this._inputStatus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputControlDirective.prototype, "control", {
        get: function () {
            return this._control.control || undefined;
        },
        enumerable: true,
        configurable: true
    });
    InputControlDirective.prototype.updateInputStatus = function (_a) {
        var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
        var status = inputStatusControl(this.control);
        status = this.addReadiness(status);
        status = this.addErrors(status);
        if (!status.equals(this._inputStatus)) {
            this._inputStatus = status;
            if (emitEvents !== false) {
                this.inputStatusChange.emit(status);
            }
        }
        return status;
    };
    InputControlDirective.prototype.addReadiness = function (status) {
        var control = this.control;
        if (!control) {
            return status.merge(InputReady);
        }
        var affected = control.dirty || !this._submitService || this._submitService.submitted;
        var ready = !(control.invalid && affected);
        return status.merge(ready ? InputReady : InputNotReady);
    };
    InputControlDirective.prototype.addErrors = function (status) {
        var control = this.control;
        if (!control) {
            return status;
        }
        var errors = control.errors;
        if (errors) {
            return status.merge(inputErrors(errors));
        }
        return status;
    };
    InputControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._preSubmitSubscr =
            this._submitService && this._submitService.preSubmit.subscribe(function () { return _this.updateInputStatus(); });
        var control = this.control;
        if (control) {
            this._stateSubscr = control.statusChanges.subscribe(function () { return _this.updateInputStatus(); });
        }
        this.updateInputStatus({ emitEvents: false });
        this._regHandle = this._submitGroup && this._submitGroup.addSubmittable(this);
    };
    InputControlDirective.prototype.ngOnDestroy = function () {
        if (this._regHandle) {
            this._regHandle.unregister();
            delete this._regHandle;
        }
        if (this._stateSubscr) {
            this._stateSubscr.unsubscribe();
            delete this._stateSubscr;
        }
        if (this._preSubmitSubscr) {
            this._preSubmitSubscr.unsubscribe();
            delete this._preSubmitSubscr;
        }
    };
    return InputControlDirective;
}(Submittable));
InputControlDirective = __decorate([
    Directive({
        selector: '[ngModel],[formControl],[formControlName]'
    }),
    __param(0, Host()),
    __param(1, Optional()),
    __param(2, Optional()),
    __metadata("design:paramtypes", [NgControl,
        SubmitGroup,
        SubmitService])
], InputControlDirective);
export { InputControlDirective };
