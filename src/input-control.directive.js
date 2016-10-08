var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
import { Directive, Host, EventEmitter } from "@angular/core";
import { NgControl } from "@angular/forms";
import { Submittable, SubmitGroup, SubmitService } from "./model";
import { InputReady, InputNotReady, inputErrors } from "./input-status";
import { inputStatusControl } from "./input-status";
export var InputControlDirective = (function (_super) {
    __extends(InputControlDirective, _super);
    function InputControlDirective(_submitGroup, _submitService, _control) {
        _super.call(this);
        this._submitGroup = _submitGroup;
        this._submitService = _submitService;
        this._control = _control;
        this.inputStatusChange = new EventEmitter();
        this._inputStatus = InputReady;
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
            return this._control.control;
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
        var ready = !(this.control.invalid && (this.control.dirty || this._submitService.submitted));
        return status.merge(ready ? InputReady : InputNotReady);
    };
    InputControlDirective.prototype.addErrors = function (status) {
        var errors = this.control.errors;
        if (errors) {
            return status.merge(inputErrors(errors));
        }
        return status;
    };
    InputControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(function () { return _this.updateInputStatus(); });
        this._stateSubscr = this.control.statusChanges.subscribe(function () { return _this.updateInputStatus(); });
        this.updateInputStatus({ emitEvents: false });
        this._regHandle = this._submitGroup.addSubmittable(this);
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
    InputControlDirective = __decorate([
        Directive({
            selector: '[ngModel],[formControl],[formControlName]'
        }),
        __param(2, Host()), 
        __metadata('design:paramtypes', [SubmitGroup, SubmitService, NgControl])
    ], InputControlDirective);
    return InputControlDirective;
}(Submittable));
//# sourceMappingURL=input-control.directive.js.map