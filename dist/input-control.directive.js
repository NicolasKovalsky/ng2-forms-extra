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
import { Directive, Host, EventEmitter, Optional } from "@angular/core";
import { NgControl } from "@angular/forms";
import { Submittable, SubmitGroup, SubmitService } from "./model";
import { InputReady, InputNotReady, inputErrors } from "./input-status";
import { inputStatusControl } from "./input-status";
var InputControlDirective = /** @class */ (function (_super) {
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
    InputControlDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngModel],[formControl],[formControlName]'
                },] },
    ];
    /** @nocollapse */
    InputControlDirective.ctorParameters = function () { return [
        { type: NgControl, decorators: [{ type: Host },] },
        { type: SubmitGroup, decorators: [{ type: Optional },] },
        { type: SubmitService, decorators: [{ type: Optional },] },
    ]; };
    return InputControlDirective;
}(Submittable));
export { InputControlDirective };
//# sourceMappingURL=C:/Users/info/Desktop/Projects/Smart Warehousing/ng2-forms-extra/src/input-control.directive.js.map