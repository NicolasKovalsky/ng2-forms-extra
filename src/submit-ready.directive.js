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
import { Directive, HostListener, Output, EventEmitter, forwardRef } from "@angular/core";
import { SubmitService, SubmitGroup } from "./model";
var SubmitReadyDirective = SubmitReadyDirective_1 = (function (_super) {
    __extends(SubmitReadyDirective, _super);
    function SubmitReadyDirective() {
        var _this = _super.call(this) || this;
        _this.preSubmit = new EventEmitter();
        _this.submitReady = new EventEmitter();
        return _this;
    }
    SubmitReadyDirective.prototype.onSubmit = function () {
        this.submit();
    };
    SubmitReadyDirective.prototype.submit = function () {
        this._submitted = true;
        this.preSubmit.emit(null);
        var status = this.updateInputStatus({ emitEvents: false });
        if (!status.ready) {
            return false;
        }
        this.submitReady.emit(null);
        return true;
    };
    SubmitReadyDirective.prototype.ngOnDestroy = function () {
        this.submitReady.complete();
    };
    return SubmitReadyDirective;
}(SubmitService));
__decorate([
    Output(),
    __metadata("design:type", Object)
], SubmitReadyDirective.prototype, "preSubmit", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], SubmitReadyDirective.prototype, "submitReady", void 0);
__decorate([
    HostListener('ngSubmit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubmitReadyDirective.prototype, "onSubmit", null);
SubmitReadyDirective = SubmitReadyDirective_1 = __decorate([
    Directive({
        selector: 'form:not([ngNoForm]),ngForm,[ngForm],[formGroup]:not([noSubmitGroup])',
        exportAs: "frexSubmit",
        providers: [
            {
                provide: SubmitService,
                useExisting: forwardRef(function () { return SubmitReadyDirective_1; }),
            },
            {
                provide: SubmitGroup,
                useExisting: SubmitService,
            },
        ]
    }),
    __metadata("design:paramtypes", [])
], SubmitReadyDirective);
export { SubmitReadyDirective };
var SubmitReadyDirective_1;
