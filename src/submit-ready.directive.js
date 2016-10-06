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
import { Directive, HostListener, Output, EventEmitter, forwardRef } from "@angular/core";
import { SubmitService } from "./submit.service";
var resolved = Promise.resolve();
export var SubmitReadyDirective = (function (_super) {
    __extends(SubmitReadyDirective, _super);
    function SubmitReadyDirective() {
        _super.call(this);
        this.readyStateChanges = new EventEmitter();
        this.preSubmit = new EventEmitter();
        this.submitReady = new EventEmitter();
        this._ready = true;
        this._idSeq = 0;
        this._readyForSubmit = {};
    }
    Object.defineProperty(SubmitReadyDirective.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: true,
        configurable: true
    });
    SubmitReadyDirective.prototype.onSubmit = function () {
        this.submit();
    };
    SubmitReadyDirective.prototype.addReadyForSubmit = function (ready) {
        var _this = this;
        var id = "" + ++this._idSeq;
        this._readyForSubmit[id] = ready;
        var subscr = ready.readyStateChanges.subscribe(function (ready) {
            if (!ready) {
                resolved.then(function () { return _this.setReadyState(false); });
            }
            else {
                resolved.then(function () { return _this.updateReadyState(); });
            }
        });
        return {
            unregister: function () {
                delete _this._readyForSubmit[id];
                subscr.unsubscribe();
            }
        };
    };
    SubmitReadyDirective.prototype.updateReadyState = function (_a) {
        var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
        var ready = true;
        for (var id in this._readyForSubmit) {
            if (this._readyForSubmit.hasOwnProperty(id)) {
                if (!this._readyForSubmit[id].updateReadyState({ emitEvents: emitEvents })) {
                    ready = false;
                    break;
                }
            }
        }
        this.setReadyState(ready, { emitEvents: emitEvents });
        return ready;
    };
    SubmitReadyDirective.prototype.setReadyState = function (ready, _a) {
        var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
        if (this._ready === ready) {
            return;
        }
        this._ready = ready;
        if (emitEvents !== false) {
            this.readyStateChanges.emit(ready);
        }
    };
    SubmitReadyDirective.prototype.submit = function () {
        this._submitted = true;
        this.preSubmit.emit(null);
        if (!this.updateReadyState({ emitEvents: false })) {
            return false;
        }
        this.submitReady.emit(null);
        return true;
    };
    SubmitReadyDirective.prototype.ngOnDestroy = function () {
        this.submitReady.complete();
    };
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], SubmitReadyDirective.prototype, "readyStateChanges", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], SubmitReadyDirective.prototype, "preSubmit", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], SubmitReadyDirective.prototype, "submitReady", void 0);
    __decorate([
        HostListener('ngSubmit'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], SubmitReadyDirective.prototype, "onSubmit", null);
    SubmitReadyDirective = __decorate([
        Directive({
            selector: 'form:not([ngNoForm]),ngForm,[ngForm],[formGroup]',
            exportAs: "frexSubmit",
            providers: [
                {
                    provide: SubmitService,
                    useExisting: forwardRef(function () { return SubmitReadyDirective; }),
                },
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SubmitReadyDirective);
    return SubmitReadyDirective;
}(SubmitService));
//# sourceMappingURL=submit-ready.directive.js.map