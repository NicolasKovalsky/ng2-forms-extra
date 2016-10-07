(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', '@angular/forms'], factory) :
    (factory((global.ng2frex = global.ng2frex || {}),global._angular_common,global._angular_core,global._angular_forms));
}(this, (function (exports,_angular_common,_angular_core,_angular_forms) { 'use strict';

var __extends$1 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Registry = (function () {
    function Registry() {
        this.changes = new _angular_core.EventEmitter();
        this._map = {};
        this._idSeq = 0;
    }
    Object.defineProperty(Registry.prototype, "list", {
        get: function () {
            if (this._list) {
                return this._list;
            }
            var list = [];
            for (var id in this._map) {
                if (this._map.hasOwnProperty(id)) {
                    list.push(this._map[id]);
                }
            }
            return this._list = list;
        },
        enumerable: true,
        configurable: true
    });
    Registry.prototype.add = function (item, handle) {
        var unregister = !handle ? (function () { }) : typeof handle === "function" ? handle : (function () { return handle.unregister(); });
        var id = "" + ++this._idSeq;
        var self = this;
        this._map[id] = item;
        this._list = undefined;
        this.changes.emit(this.list);
        return {
            unregister: function () {
                delete self._map[id];
                self._list = undefined;
                self.changes.emit(self.list);
                unregister();
            }
        };
    };
    return Registry;
}());
var resolved = Promise.resolve();
var SubmitGroup = (function () {
    function SubmitGroup() {
        this.readyStateChanges = new _angular_core.EventEmitter();
        this._registry = new Registry();
        this._ready = true;
    }
    Object.defineProperty(SubmitGroup.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitGroup.prototype, "submittableChanges", {
        get: function () {
            return this._registry.changes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SubmitGroup.prototype, "submittables", {
        get: function () {
            return this._registry.list;
        },
        enumerable: true,
        configurable: true
    });
    SubmitGroup.prototype.updateReadyState = function (_a) {
        var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
        var ready = !this.submittables.some(function (s) { return !s.updateReadyState({ emitEvents: false }); });
        this.setReadyState(ready, { emitEvents: emitEvents });
        return ready;
    };
    SubmitGroup.prototype.setReadyState = function (ready, _a) {
        var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
        if (this._ready === ready) {
            return;
        }
        this._ready = ready;
        if (emitEvents !== false) {
            this.readyStateChanges.emit(ready);
        }
    };
    SubmitGroup.prototype.addSubmittable = function (submittable) {
        var _this = this;
        var subscr;
        var reg = this.registerSubmittable(submittable);
        var handle = this._registry.add(submittable, function () {
            subscr && subscr.unsubscribe();
            try {
                reg.unregister();
            }
            finally {
                _this.updateReadyState();
            }
        });
        this.updateReadyState();
        subscr = submittable.readyStateChanges.subscribe(function (ready) {
            if (!ready) {
                resolved.then(function () { return _this.setReadyState(false); });
            }
            else {
                resolved.then(function () { return _this.updateReadyState(); });
            }
        });
        return handle;
    };
    SubmitGroup.prototype.registerSubmittable = function (_submittable) {
        return {
            unregister: function () { }
        };
    };
    return SubmitGroup;
}());
var InputService = (function (_super) {
    __extends$1(InputService, _super);
    function InputService() {
        _super.apply(this, arguments);
    }
    return InputService;
}(SubmitGroup));
var SubmitService = (function (_super) {
    __extends$1(SubmitService, _super);
    function SubmitService() {
        _super.apply(this, arguments);
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
}(SubmitGroup));

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
var SubmitReadyDirective = (function (_super) {
    __extends(SubmitReadyDirective, _super);
    function SubmitReadyDirective() {
        _super.call(this);
        this.preSubmit = new _angular_core.EventEmitter();
        this.submitReady = new _angular_core.EventEmitter();
    }
    SubmitReadyDirective.prototype.onSubmit = function () {
        this.submit();
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
                {
                    provide: SubmitGroup,
                    useExisting: SubmitService,
                },
            ]
        }), 
        __metadata$1('design:paramtypes', [])
    ], SubmitReadyDirective);
    return SubmitReadyDirective;
}(SubmitService));

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$2 = (undefined && undefined.__metadata) || function (k, v) {
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
    __decorate$2([
        _angular_core.Input(), 
        __metadata$2('design:type', Boolean)
    ], NonBlankDirective.prototype, "nonBlank", null);
    NonBlankDirective = __decorate$2([
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
        __metadata$2('design:paramtypes', [])
    ], NonBlankDirective);
    return NonBlankDirective;
}());

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$3 = (undefined && undefined.__metadata) || function (k, v) {
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
    __decorate$3([
        _angular_core.Input(), 
        __metadata$3('design:type', _angular_forms.AbstractControlDirective), 
        __metadata$3('design:paramtypes', [_angular_forms.AbstractControlDirective])
    ], RepeatOfDirective.prototype, "repeatOf", null);
    RepeatOfDirective = __decorate$3([
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
        __metadata$3('design:paramtypes', [_angular_core.Injector])
    ], RepeatOfDirective);
    return RepeatOfDirective;
}());

var __extends$2 = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$4 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InputDirective = (function (_super) {
    __extends$2(InputDirective, _super);
    function InputDirective(_submitService) {
        _super.call(this);
        this._submitService = _submitService;
    }
    InputDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._regHandle = this._submitService.addSubmittable(this);
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(function () { return _this.updateReadyState(); });
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
    InputDirective = __decorate$4([
        _angular_core.Directive({
            selector: '[inputStatus]',
            exportAs: "frexInput",
            providers: [
                {
                    provide: InputService,
                    useExisting: _angular_core.forwardRef(function () { return InputDirective; }),
                },
                {
                    provide: SubmitGroup,
                    useExisting: InputService,
                },
            ]
        }), 
        __metadata$4('design:paramtypes', [SubmitService])
    ], InputDirective);
    return InputDirective;
}(InputService));

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$5 = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InputControlDirective = (function () {
    function InputControlDirective(_inputService, _submitGroup, _submitService, _control) {
        this._inputService = _inputService;
        this._submitGroup = _submitGroup;
        this._submitService = _submitService;
        this._control = _control;
        this.readyStateChanges = new _angular_core.EventEmitter();
        this._ready = true;
    }
    Object.defineProperty(InputControlDirective.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputControlDirective.prototype, "control", {
        get: function () {
            return this._control.control;
        },
        enumerable: true,
        configurable: true
    });
    InputControlDirective.prototype.updateReadyState = function (_a) {
        var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
        var ready = !(this.control.invalid && (this.control.dirty || this._submitService.submitted));
        if (this._ready !== ready) {
            this._ready = ready;
            if (emitEvents !== false) {
                this.readyStateChanges.emit(ready);
            }
        }
        return ready;
    };
    InputControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._preSubmitSubscr = this._submitService.preSubmit.subscribe(function () { return _this.updateReadyState(); });
        this._stateSubscr = this.control.statusChanges.subscribe(function () { return _this.updateReadyState(); });
        this.updateReadyState({ emitEvents: false });
        this._regHandle =
            this._inputService ? this._inputService.addSubmittable(this) : this._submitGroup.addSubmittable(this);
    };
    InputControlDirective.prototype.ngOnDestroy = function () {
        if (this._regHandle) {
            this._regHandle.unregister();
            delete this._regHandle;
        }
        if (this._stateSubscr) {
            this._stateSubscr.unsubscribe();
            delete this._stateSubscr;
        }
        if (this._preSubmitSubscr) {
            this._preSubmitSubscr.unsubscribe();
            delete this._preSubmitSubscr;
        }
    };
    InputControlDirective = __decorate$5([
        _angular_core.Directive({
            selector: '[ngModel],[formControl],[formControlName]'
        }),
        __param(0, _angular_core.Optional()),
        __param(3, _angular_core.Host()), 
        __metadata$5('design:paramtypes', [InputService, SubmitGroup, SubmitService, _angular_forms.NgControl])
    ], InputControlDirective);
    return InputControlDirective;
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
var __param$1 = (undefined && undefined.__param) || function (paramIndex, decorator) {
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
var resolved$1 = Promise.resolve();
var InputErrorsComponent = (function () {
    function InputErrorsComponent(_inputService) {
        this._inputService = _inputService;
        this._errors = [];
        this.inputErrorsMap = {};
    }
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
        var _this = this;
        this._subscription = this._inputService.submittableChanges.subscribe(function (controls) { return _this.updateInputs(controls); });
        this.updateInputs(this._inputService.submittables);
    };
    InputErrorsComponent.prototype.ngOnDestroy = function () {
        if (this._subscription) {
            this._subscription.unsubscribe();
            delete this._subscription;
        }
    };
    InputErrorsComponent.prototype.trackError = function (error) {
        return error.key;
    };
    InputErrorsComponent.prototype.updateInputs = function (controls) {
        var _this = this;
        var updateErrors = function () { return resolved$1.then(function () {
            _this._errors.splice(0);
            controls.map(function (s) { return s.control; }).filter(function (control) { return !!control.errors; }).forEach(function (control) {
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
        }); };
        controls.forEach(function (s) { return s.control.statusChanges.subscribe(updateErrors); });
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
    __decorate$6([
        _angular_core.Input(), 
        __metadata$6('design:type', Object)
    ], InputErrorsComponent.prototype, "inputErrorsMap", void 0);
    InputErrorsComponent = __decorate$6([
        _angular_core.Component({
            selector: 'input-errors,[inputErrors],[inputErrorsMap]',
            template: "\n    <ul class=\"frex-error-list\" *ngIf=\"hasErrors\">\n        <li *ngFor=\"let error of errors; trackBy: trackError\" class=\"frex-error\">{{error.message}}</li>\n    </ul>\n    ",
            host: {
                '[class.frex-errors]': 'true',
                '[class.frex-errors-hidden]': '!hasErrors',
            }
        }),
        __param$1(0, _angular_core.Optional()), 
        __metadata$6('design:paramtypes', [InputService])
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

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$7 = (undefined && undefined.__metadata) || function (k, v) {
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
    __decorate$7([
        _angular_core.HostBinding("class.frex-invalid"), 
        __metadata$7('design:type', Boolean)
    ], InputStatusDirective.prototype, "invalid", null);
    InputStatusDirective = __decorate$7([
        _angular_core.Directive({
            selector: '[inputStatus]',
        }), 
        __metadata$7('design:paramtypes', [InputService])
    ], InputStatusDirective);
    return InputStatusDirective;
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
                InputControlDirective,
                InputErrorsComponent,
                InputStatusDirective,
            ],
            exports: [
                _angular_forms.FormsModule,
                SubmitReadyDirective,
                NonBlankDirective,
                RepeatOfDirective,
                InputDirective,
                InputControlDirective,
                InputErrorsComponent,
                InputStatusDirective,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], FormsExtraModule);
    return FormsExtraModule;
}());

exports.FormsExtraModule = FormsExtraModule;
exports.InputDirective = InputDirective;
exports.InputControlDirective = InputControlDirective;
exports.InputErrorsComponent = InputErrorsComponent;
exports.InputStatusDirective = InputStatusDirective;
exports.Registry = Registry;
exports.SubmitGroup = SubmitGroup;
exports.InputService = InputService;
exports.SubmitService = SubmitService;
exports.NonBlankDirective = NonBlankDirective;
exports.RepeatOfDirective = RepeatOfDirective;
exports.SubmitReadyDirective = SubmitReadyDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));