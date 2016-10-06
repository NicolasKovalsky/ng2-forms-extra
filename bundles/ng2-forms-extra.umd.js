(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', '@angular/forms'], factory) :
    (factory((global.ng2frex = global.ng2frex || {}),global._angular_common,global._angular_core,global._angular_forms));
}(this, (function (exports,_angular_common,_angular_core,_angular_forms) { 'use strict';

var SubmitService = (function () {
    function SubmitService() {
        this._submitted = false;
    }
    Object.defineProperty(SubmitService.prototype, "submitted", {
        get: function () {
            return this._submitted;
        },
        enumerable: true,
        configurable: true
    });
    SubmitService.prototype.resetSubmitted = function () {
        this._submitted = false;
    };
    return SubmitService;
}());

var __extends = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$1 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var resolved = Promise.resolve();
var SubmitReadyDirective = (function (_super) {
    __extends(SubmitReadyDirective, _super);
    function SubmitReadyDirective() {
        _super.call(this);
        this.readyStateChanges = new _angular_core.EventEmitter();
        this.preSubmit = new _angular_core.EventEmitter();
        this.submitReady = new _angular_core.EventEmitter();
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
    __decorate$1([
        _angular_core.Output(), 
        __metadata$1('design:type', Object)
    ], SubmitReadyDirective.prototype, "readyStateChanges", void 0);
    __decorate$1([
        _angular_core.Output(), 
        __metadata$1('design:type', Object)
    ], SubmitReadyDirective.prototype, "preSubmit", void 0);
    __decorate$1([
        _angular_core.Output(), 
        __metadata$1('design:type', Object)
    ], SubmitReadyDirective.prototype, "submitReady", void 0);
    __decorate$1([
        _angular_core.HostListener('ngSubmit'), 
        __metadata$1('design:type', Function), 
        __metadata$1('design:paramtypes', []), 
        __metadata$1('design:returntype', void 0)
    ], SubmitReadyDirective.prototype, "onSubmit", null);
    SubmitReadyDirective = __decorate$1([
        _angular_core.Directive({
            selector: 'form:not([ngNoForm]),ngForm,[ngForm],[formGroup]',
            exportAs: "frexSubmit",
            providers: [
                {
                    provide: SubmitService,
                    useExisting: _angular_core.forwardRef(function () { return SubmitReadyDirective; }),
                },
            ]
        }), 
        __metadata$1('design:paramtypes', [])
    ], SubmitReadyDirective);
    return SubmitReadyDirective;
}(SubmitService));

var InputService = (function () {
    function InputService() {
        this.controlChanges = new _angular_core.EventEmitter();
        this.readyStateChanges = new _angular_core.EventEmitter();
    }
    return InputService;
}());

var __extends$1 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$2 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var resolved$1 = Promise.resolve();
var InputDirective = (function (_super) {
    __extends$1(InputDirective, _super);
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
                var updateControlStatus = function () { return resolved$1.then(function () {
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
    __decorate$2([
        _angular_core.ContentChildren(_angular_forms.NgControl), 
        __metadata$2('design:type', _angular_core.QueryList)
    ], InputDirective.prototype, "_inputs", void 0);
    __decorate$2([
        _angular_core.Input(), 
        __metadata$2('design:type', _angular_forms.AbstractControl), 
        __metadata$2('design:paramtypes', [_angular_forms.AbstractControl])
    ], InputDirective.prototype, "inputStatus", null);
    InputDirective = __decorate$2([
        _angular_core.Directive({
            selector: '[inputStatus]',
            exportAs: "frexInput",
            providers: [{
                    provide: InputService,
                    useExisting: _angular_core.forwardRef(function () { return InputDirective; }),
                }]
        }), 
        __metadata$2('design:paramtypes', [SubmitService])
    ], InputDirective);
    return InputDirective;
}(InputService));

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$3 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InputStatusDirective = (function () {
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
    __decorate$3([
        _angular_core.HostBinding("class.frex-invalid"), 
        __metadata$3('design:type', Boolean)
    ], InputStatusDirective.prototype, "invalid", null);
    InputStatusDirective = __decorate$3([
        _angular_core.Directive({
            selector: '[inputStatus]',
        }), 
        __metadata$3('design:paramtypes', [InputService])
    ], InputStatusDirective);
    return InputStatusDirective;
}());

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$4 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DEFAULT_INPUT_ERRORS_MAP = {
    required: "This field is required",
    minlength: function (error) {
        if (error && error.requiredLength > 0) {
            return "The value should be at least " + error.requiredLength + " characters long";
        }
        return "The value is too short";
    },
    maxlength: function (error) {
        if (error && error.requiredLength > 0) {
            return "The value should be at most " + error.requiredLength + " characters long";
        }
        return "The value is too long";
    },
};
var InputErrorsComponent = (function () {
    function InputErrorsComponent(_inputService) {
        this._inputService = _inputService;
        this._errors = [];
        this.inputErrorsMap = {};
    }
    Object.defineProperty(InputErrorsComponent.prototype, "inputErrors", {
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
    Object.defineProperty(InputErrorsComponent.prototype, "hasErrors", {
        get: function () {
            return !this._inputService.ready && this.errors.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputErrorsComponent.prototype, "errors", {
        get: function () {
            return this._errors;
        },
        enumerable: true,
        configurable: true
    });
    InputErrorsComponent.prototype.ngOnInit = function () {
        if (!this._subscription) {
            this.subscribe();
        }
    };
    InputErrorsComponent.prototype.ngAfterViewInit = function () {
        if (!this._subscription) {
            this.subscribe();
        }
    };
    InputErrorsComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe();
    };
    InputErrorsComponent.prototype.trackError = function (error) {
        return error.key;
    };
    InputErrorsComponent.prototype.subscribe = function () {
        var _this = this;
        if (this._input) {
            this._subscription = this._input.statusChanges.subscribe(function () { return _this.updateInputs([_this._input]); });
        }
        else if (this._inputService) {
            this._subscription = this._inputService.controlChanges.subscribe(function () { return _this.updateInputs(_this._inputService.controls); });
        }
    };
    InputErrorsComponent.prototype.updateInputs = function (controls) {
        var _this = this;
        var updateErrors = function () {
            _this._errors.splice(0);
            controls.filter(function (control) { return !!control.errors; }).forEach(function (control) {
                var errors = control.errors;
                for (var key in errors) {
                    if (errors.hasOwnProperty(key)) {
                        var message = _this.errorMessage(control, key, errors[key]);
                        if (message != null) {
                            _this._errors.push({ key: key, message: message });
                        }
                    }
                }
            });
        };
        controls.forEach(function (control) { return control.statusChanges.subscribe(updateErrors); });
        updateErrors();
    };
    InputErrorsComponent.prototype.errorMessage = function (control, key, value) {
        if (value == null) {
            return undefined;
        }
        var known = this.inputErrorsMap[key];
        if (known != null) {
            return errorMessage(control, value, known);
        }
        var defaultMsg = errorMessage(control, value, DEFAULT_INPUT_ERRORS_MAP[key]);
        if (defaultMsg != null) {
            return defaultMsg;
        }
        if (typeof value === "string") {
            return value;
        }
        return key;
    };
    InputErrorsComponent.prototype.unsubscribe = function () {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = undefined;
        }
    };
    __decorate$4([
        _angular_core.Input(), 
        __metadata$4('design:type', Object)
    ], InputErrorsComponent.prototype, "inputErrorsMap", void 0);
    __decorate$4([
        _angular_core.Input(), 
        __metadata$4('design:type', _angular_forms.AbstractControl), 
        __metadata$4('design:paramtypes', [_angular_forms.AbstractControl])
    ], InputErrorsComponent.prototype, "inputErrors", null);
    InputErrorsComponent = __decorate$4([
        _angular_core.Component({
            selector: 'input-errors,[inputErrors],[inputErrorsMap]',
            template: "\n    <ul class=\"frex-error-list\" *ngIf=\"hasErrors\">\n        <li *ngFor=\"let error of errors; trackBy: trackError\" class=\"frex-error\">{{error.message}}</li>\n    </ul>\n    ",
            host: {
                '[class.frex-errors]': 'true',
                '[class.frex-errors-hidden]': '!hasErrors',
            }
        }),
        __param(0, _angular_core.Optional()), 
        __metadata$4('design:paramtypes', [InputService])
    ], InputErrorsComponent);
    return InputErrorsComponent;
}());
function errorMessage(control, value, message) {
    if (message == null) {
        return undefined;
    }
    if (typeof message === "string") {
        return message;
    }
    return message(value, control);
}

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$5 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VALID = null;
var NOOP = function () { };
var NonBlankDirective = (function () {
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
        return this.nonBlank ? _angular_forms.Validators.required(c) : VALID;
    };
    NonBlankDirective.prototype.registerOnValidatorChange = function (fn) {
        this._onChange = fn || NOOP;
    };
    __decorate$5([
        _angular_core.Input(), 
        __metadata$5('design:type', Boolean)
    ], NonBlankDirective.prototype, "nonBlank", null);
    NonBlankDirective = __decorate$5([
        _angular_core.Directive({
            selector: '[nonBlank]',
            providers: [
                {
                    provide: _angular_forms.NG_VALIDATORS,
                    useExisting: _angular_core.forwardRef(function () { return NonBlankDirective; }),
                    multi: true,
                }
            ],
        }), 
        __metadata$5('design:paramtypes', [])
    ], NonBlankDirective);
    return NonBlankDirective;
}());

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$6 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VALID$1 = null;
var NOOP$1 = function () { };
var RepeatOfDirective = (function () {
    function RepeatOfDirective(_injector) {
        this._injector = _injector;
        this._onChange = NOOP$1;
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
            return VALID$1;
        }
        if (control.value == null || control.value === "") {
            return VALID$1;
        }
        if (control.value == this._repeatOf.value) {
            return VALID$1;
        }
        return { "repeat": "Values don't match" };
    };
    RepeatOfDirective.prototype.registerOnValidatorChange = function (fn) {
        this._onChange = fn || NOOP$1;
    };
    RepeatOfDirective.prototype.ngOnDestroy = function () {
        this.unsubscribe();
    };
    RepeatOfDirective.prototype.subscribe = function () {
        if (!this._repeatOf) {
            return;
        }
        var control = this._injector.get(_angular_forms.NgControl);
        this._repeatOfSubscr = this._repeatOf.control.valueChanges.subscribe(function (value) { return control.control.updateValueAndValidity(); });
    };
    RepeatOfDirective.prototype.unsubscribe = function () {
        if (this._repeatOfSubscr) {
            this._repeatOfSubscr.unsubscribe();
            this._repeatOfSubscr = undefined;
        }
    };
    __decorate$6([
        _angular_core.Input(), 
        __metadata$6('design:type', _angular_forms.AbstractControlDirective), 
        __metadata$6('design:paramtypes', [_angular_forms.AbstractControlDirective])
    ], RepeatOfDirective.prototype, "repeatOf", null);
    RepeatOfDirective = __decorate$6([
        _angular_core.Directive({
            selector: '[repeatOf]',
            providers: [
                {
                    provide: _angular_forms.NG_VALIDATORS,
                    useExisting: _angular_core.forwardRef(function () { return RepeatOfDirective; }),
                    multi: true,
                }
            ],
        }), 
        __metadata$6('design:paramtypes', [_angular_core.Injector])
    ], RepeatOfDirective);
    return RepeatOfDirective;
}());

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FormsExtraModule = (function () {
    function FormsExtraModule() {
    }
    FormsExtraModule = __decorate([
        _angular_core.NgModule({
            imports: [
                _angular_common.CommonModule,
                _angular_forms.FormsModule,
            ],
            declarations: [
                SubmitReadyDirective,
                NonBlankDirective,
                RepeatOfDirective,
                InputDirective,
                InputStatusDirective,
                InputErrorsComponent,
            ],
            exports: [
                _angular_forms.FormsModule,
                SubmitReadyDirective,
                NonBlankDirective,
                RepeatOfDirective,
                InputDirective,
                InputStatusDirective,
                InputErrorsComponent,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], FormsExtraModule);
    return FormsExtraModule;
}());

exports.FormsExtraModule = FormsExtraModule;
exports.InputDirective = InputDirective;
exports.InputService = InputService;
exports.InputErrorsComponent = InputErrorsComponent;
exports.InputStatusDirective = InputStatusDirective;
exports.NonBlankDirective = NonBlankDirective;
exports.RepeatOfDirective = RepeatOfDirective;
exports.SubmitService = SubmitService;
exports.SubmitReadyDirective = SubmitReadyDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));