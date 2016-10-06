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
import { Directive, Input, QueryList, ContentChildren, forwardRef } from "@angular/core";
import { AbstractControl, NgControl } from "@angular/forms";
import { InputService } from "./input.service";
import { SubmitService } from "./submit.service";
var resolved = Promise.resolve();
export var InputDirective = (function (_super) {
    __extends(InputDirective, _super);
    function InputDirective(_submitService) {
        _super.call(this);
        this._submitService = _submitService;
        this._controls = [];
        this._ready = true;
        this._status = {
            invalid: false,
            dirty: false,
            touched: false,
        };
    }
    Object.defineProperty(InputDirective.prototype, "inputStatus", {
        set: function (input) {
            if (this._input === input) {
                return;
            }
            this._input = input;
            this.unsubscribe();
            this.subscribe();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputDirective.prototype, "controls", {
        get: function () {
            return this._controls;
        },
        set: function (controls) {
            this._controls = controls;
            this.controlChanges.emit(this._controls);
            this._controls.forEach(function (control) { return control.updateValueAndValidity(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputDirective.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: true,
        configurable: true
    });
    InputDirective.prototype.ngAfterViewInit = function () {
        this.subscribe();
    };
    InputDirective.prototype.ngAfterContentInit = function () {
        if (!this._contentSubscr) {
            this.subscribe();
        }
    };
    InputDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._readyHandle = this._submitService.addReadyForSubmit(this);
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(function () { return _this.updateReadyState(); });
        this._controlsSubscr = this.controlChanges.subscribe(function (controls) {
            var statuses = new Array(controls.length);
            controls.forEach(function (control, index) {
                var updateControlStatus = function () { return resolved.then(function () {
                    statuses[index] = {
                        invalid: !!control.invalid,
                        dirty: !!control.dirty,
                        touched: !!control.touched,
                    };
                    _this.updateStatus(statuses);
                }); };
                control.statusChanges.subscribe(updateControlStatus);
                updateControlStatus();
            });
        });
    };
    InputDirective.prototype.updateReadyState = function (_a) {
        var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
        var ready = !(this._status.invalid && (this._status.dirty || this._submitService.submitted));
        if (ready !== this._ready) {
            this._ready = ready;
            if (emitEvents !== false) {
                this.readyStateChanges.emit(ready);
            }
        }
        return ready;
    };
    InputDirective.prototype.updateStatus = function (statuses) {
        var newStatus = {
            invalid: false,
            dirty: false,
            touched: false,
        };
        statuses.forEach(function (status) {
            newStatus.invalid = newStatus.invalid || status.invalid;
            newStatus.dirty = newStatus.dirty || status.dirty;
            newStatus.touched = newStatus.touched || status.touched;
        });
        this._status = newStatus;
        this.updateReadyState();
    };
    InputDirective.prototype.ngOnDestroy = function () {
        if (this._readyHandle) {
            this._readyHandle.unregister();
            delete this._readyHandle;
        }
        if (this._preSubmitSubscr) {
            this._preSubmitSubscr.unsubscribe();
            delete this._preSubmitSubscr;
        }
        if (this._controlsSubscr) {
            this._controlsSubscr.unsubscribe();
            delete this._controlsSubscr;
        }
        this.unsubscribe();
    };
    InputDirective.prototype.subscribe = function () {
        var _this = this;
        if (this._input) {
            this.controls = [this._input];
        }
        else if (this._inputs) {
            this._contentSubscr = this._inputs.changes.subscribe(function () { return _this.updateInputs(); });
            this.updateInputs();
        }
    };
    InputDirective.prototype.updateInputs = function () {
        this.controls = this._inputs.map(function (ctr) { return ctr.control; });
    };
    InputDirective.prototype.unsubscribe = function () {
        if (this._contentSubscr) {
            this._contentSubscr.unsubscribe();
            this._contentSubscr = undefined;
        }
        this.controls = [];
    };
    __decorate([
        ContentChildren(NgControl), 
        __metadata('design:type', QueryList)
    ], InputDirective.prototype, "_inputs", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', AbstractControl), 
        __metadata('design:paramtypes', [AbstractControl])
    ], InputDirective.prototype, "inputStatus", null);
    InputDirective = __decorate([
        Directive({
            selector: '[inputStatus]',
            exportAs: "frexInput",
            providers: [{
                    provide: InputService,
                    useExisting: forwardRef(function () { return InputDirective; }),
                }]
        }), 
        __metadata('design:paramtypes', [SubmitService])
    ], InputDirective);
    return InputDirective;
}(InputService));
//# sourceMappingURL=input.directive.js.map