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
import { Directive, HostListener, Output, EventEmitter, forwardRef } from "@angular/core";
import { SubmitService, SubmitGroup } from "./model";
var SubmitReadyDirective = /** @class */ (function (_super) {
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
    SubmitReadyDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'form:not([ngNoForm]),ngForm,[ngForm],[formGroup]:not([noSubmitGroup])',
                    exportAs: "frexSubmit",
                    providers: [
                        {
                            provide: SubmitService,
                            useExisting: forwardRef(function () { return SubmitReadyDirective; }),
                        },
                        {
                            provide: SubmitGroup,
                            useExisting: SubmitService,
                        },
                    ]
                },] },
    ];
    /** @nocollapse */
    SubmitReadyDirective.ctorParameters = function () { return []; };
    SubmitReadyDirective.propDecorators = {
        "preSubmit": [{ type: Output },],
        "submitReady": [{ type: Output },],
        "onSubmit": [{ type: HostListener, args: ['ngSubmit',] },],
    };
    return SubmitReadyDirective;
}(SubmitService));
export { SubmitReadyDirective };
//# sourceMappingURL=C:/Users/info/Desktop/Projects/Smart Warehousing/ng2-forms-extra/src/submit-ready.directive.js.map