var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, Input, forwardRef, Injector } from "@angular/core";
import { AbstractControlDirective, NgControl, NG_VALIDATORS } from "@angular/forms";
var VALID = null;
var NOOP = function () { };
var RepeatOfDirective = RepeatOfDirective_1 = (function () {
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
    return RepeatOfDirective;
}());
__decorate([
    Input(),
    __metadata("design:type", AbstractControlDirective),
    __metadata("design:paramtypes", [AbstractControlDirective])
], RepeatOfDirective.prototype, "repeatOf", null);
RepeatOfDirective = RepeatOfDirective_1 = __decorate([
    Directive({
        selector: '[repeatOf]',
        providers: [
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(function () { return RepeatOfDirective_1; }),
                multi: true,
            }
        ],
    }),
    __metadata("design:paramtypes", [Injector])
], RepeatOfDirective);
export { RepeatOfDirective };
var RepeatOfDirective_1;
