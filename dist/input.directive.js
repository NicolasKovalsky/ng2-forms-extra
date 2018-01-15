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
import { Directive, forwardRef } from "@angular/core";
import { InputService, SubmitService, SubmitGroup } from "./model";
var InputDirective = /** @class */ (function (_super) {
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
    InputDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[inputStatus],[inputGroup]',
                    exportAs: "frexInput",
                    providers: [
                        {
                            provide: InputService,
                            useExisting: forwardRef(function () { return InputDirective; }),
                        },
                        {
                            provide: SubmitGroup,
                            useExisting: InputService,
                        },
                    ]
                },] },
    ];
    /** @nocollapse */
    InputDirective.ctorParameters = function () { return [
        { type: SubmitService, },
    ]; };
    return InputDirective;
}(InputService));
export { InputDirective };
//# sourceMappingURL=C:/Users/info/Desktop/Projects/Smart Warehousing/ng2-forms-extra/src/input.directive.js.map