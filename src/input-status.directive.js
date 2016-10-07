var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, HostBinding } from "@angular/core";
import { InputService } from "./model";
export var InputStatusDirective = (function () {
    function InputStatusDirective(_inputService) {
        this._inputService = _inputService;
    }
    Object.defineProperty(InputStatusDirective.prototype, "invalid", {
        get: function () {
            return !this._inputService.ready;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        HostBinding("class.frex-invalid"), 
        __metadata('design:type', Boolean)
    ], InputStatusDirective.prototype, "invalid", null);
    InputStatusDirective = __decorate([
        Directive({
            selector: '[inputStatus]',
        }), 
        __metadata('design:paramtypes', [InputService])
    ], InputStatusDirective);
    return InputStatusDirective;
}());
//# sourceMappingURL=input-status.directive.js.map