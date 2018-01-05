var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NG_VALIDATORS, Validators } from "@angular/forms";
import { Directive, forwardRef, Input } from "@angular/core";
var NOOP = function () { };
var NonBlankDirective = NonBlankDirective_1 = (function () {
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
    return NonBlankDirective;
}());
__decorate([
    Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], NonBlankDirective.prototype, "nonBlank", null);
NonBlankDirective = NonBlankDirective_1 = __decorate([
    Directive({
        selector: '[nonBlank]',
        providers: [
            {
                provide: NG_VALIDATORS,
                useExisting: forwardRef(function () { return NonBlankDirective_1; }),
                multi: true,
            }
        ],
    })
], NonBlankDirective);
export { NonBlankDirective };
var NonBlankDirective_1;
