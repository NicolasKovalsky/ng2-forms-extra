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
import { SubmitGroup, SubmitService, InputService } from "./model";
export var InputControlDirective = (function () {
    function InputControlDirective(_inputService, _submitGroup, _submitService, _control) {
        this._inputService = _inputService;
        this._submitGroup = _submitGroup;
        this._submitService = _submitService;
        this._control = _control;
        this.readyStateChanges = new EventEmitter();
        this._ready = true;
    }
    Object.defineProperty(InputControlDirective.prototype, "ready", {
        get: function () {
            return this._ready;
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
    InputControlDirective.prototype.updateReadyState = function (_a) {
        var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
        var ready = !(this.control.invalid && (this.control.dirty || this._submitService.submitted));
        if (this._ready !== ready) {
            this._ready = ready;
            if (emitEvents !== false) {
                this.readyStateChanges.emit(ready);
            }
        }
        return ready;
    };
    InputControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(function () { return _this.updateReadyState(); });
        this._stateSubscr = this.control.statusChanges.subscribe(function () { return _this.updateReadyState(); });
        this.updateReadyState({ emitEvents: false });
        this._regHandle =
            this._inputService ? this._inputService.addSubmittable(this) : this._submitGroup.addSubmittable(this);
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
        __param(0, Optional()),
        __param(3, Host()), 
        __metadata('design:paramtypes', [InputService, SubmitGroup, SubmitService, NgControl])
    ], InputControlDirective);
    return InputControlDirective;
}());
//# sourceMappingURL=input-control.directive.js.map