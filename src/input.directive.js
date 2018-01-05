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
import { Directive, forwardRef } from "@angular/core";
import { InputService, SubmitService, SubmitGroup } from "./model";
var InputDirective = InputDirective_1 = (function (_super) {
    __extends(InputDirective, _super);
    function InputDirective(_submitService) {
        var _this = _super.call(this) || this;
        _this._submitService = _submitService;
        return _this;
    }
    InputDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._regHandle = this._submitService.addSubmittable(this);
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(function () { return _this.updateInputStatus(); });
    };
    InputDirective.prototype.ngOnDestroy = function () {
        if (this._regHandle) {
            this._regHandle.unregister();
            delete this._regHandle;
        }
        if (this._preSubmitSubscr) {
            this._preSubmitSubscr.unsubscribe();
            delete this._preSubmitSubscr;
        }
    };
    return InputDirective;
}(InputService));
InputDirective = InputDirective_1 = __decorate([
    Directive({
        selector: '[inputStatus],[inputGroup]',
        exportAs: "frexInput",
        providers: [
            {
                provide: InputService,
                useExisting: forwardRef(function () { return InputDirective_1; }),
            },
            {
                provide: SubmitGroup,
                useExisting: InputService,
            },
        ]
    }),
    __metadata("design:paramtypes", [SubmitService])
], InputDirective);
export { InputDirective };
var InputDirective_1;
