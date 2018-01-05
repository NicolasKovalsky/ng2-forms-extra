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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("src/input-status", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Input status interface.
     *
     * This is a base class for input status implementations. Actual input status can be represented by one or more input
     * status objects of different types. Input status objects of different types could be distinguished by their
     * identifiers.
     *
     * There are several predefined input status implementations. Their payload is available via methods of the base
     * class.
     *
     * Input status object is meant to be immutable.
     */
    var InputStatus = (function () {
        /**
         * Constructs input status.
         *
         * At most one object with the same identifier can exists within input status.
         *
         * @param _id a unique identifier of status object type.
         */
        function InputStatus(_id) {
            this._id = _id;
        }
        Object.defineProperty(InputStatus.prototype, "id", {
            /**
             * An identifier of status object type.
             *
             * @return {string} the identifier passed to constructor.
             */
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputStatus.prototype, "nested", {
            /**
             * Nested input status object.
             *
             * @return {Array<InputStatus>} a list of nested input status objects.
             */
            get: function () {
                return [];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputStatus.prototype, "ready", {
            /**
             * Whether the input is ready to be submitted.
             *
             * If some of the inputs are not ready, the submit would be prevented.
             *
             * When input is ready this does not necessarily mean that it is valid. Nevertheless, the validation errors won't be
             * displayed for ready for submit inputs. This typically means that user didn't entered the invalid data. On attempt
             * to submit an invalid* input will be marked as non-ready, submit will be prevented, and errors will be displayed.
             *
             * This value can be set with `InputReady` and `InputNotReady` constants.
             *
             * @return {boolean}
             */
            get: function () {
                var readiness = this.get(inputReadinessId);
                return readiness == null || readiness.ready;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputStatus.prototype, "errors", {
            /**
             * Input errors.
             *
             * Input errors could be set with `inputErrors()` method.
             *
             * @return {{}|undefined} a map of input errors, if any.
             */
            get: function () {
                var errors = this.get(inputErrorsId);
                return errors && errors.errors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputStatus.prototype, "control", {
            /**
             * A control, which status is represented by this status.
             *
             * The control can be set with `inputStatusControl()` method.
             *
             * Note that when the status is merged from multiple controls, this value will be undefined.
             *
             * @return {AbstractControl|undefined} a control instance, if eny.
             */
            get: function () {
                var statusControl = this.get(inputStatusControlId);
                return statusControl && statusControl.control;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * An input status object with the given identifier.
         *
         * @param id target identifier.
         *
         * @return {InputStatus} input status which identifier is equal to the given one, if any.
         */
        InputStatus.prototype.get = function (id) {
            return id === this.id ? this : undefined;
        };
        /**
         * Checks whether this input status is equal to another one.
         *
         * @param status an input status object to compare this one with. If omitted the method will return `false`.
         */
        InputStatus.prototype.equals = function (status) {
            if (!status) {
                return false;
            }
            if (status === this) {
                return true;
            }
            if (this.id === status.id) {
                if (this.nested.length != status.nested.length) {
                    return false;
                }
                if (!this.nested.length) {
                    return this.equalValues(status);
                }
            }
            return this.combine().equalValues(status.combine());
        };
        /**
         * Checks whether this input status is implied by another one.
         *
         * This method is called to remove unnecessary input statuses from combined ones.
         *
         * @param status another input status to check this one against.
         */
        InputStatus.prototype.impliedBy = function (status) {
            return status === this;
        };
        /**
         * Merges two input statuses.
         *
         * @param status an input status to merge this one with.
         *
         * @return {InputStatus} new input status combined from the two ones.
         */
        InputStatus.prototype.merge = function (status) {
            if (status.impliedBy(this)) {
                return this;
            }
            if (this.impliedBy(status)) {
                return status;
            }
            if (this.id === status.id && !this.nested.length && !status.nested.length) {
                return this.mergeValues(status);
            }
            return this.combine().add(status).optimize();
        };
        InputStatus.prototype.combine = function () {
            return new CombinedInputStatus().add(this);
        };
        return InputStatus;
    }());
    exports.InputStatus = InputStatus;
    var combinedInputStatusId = "__combined__";
    var CombinedInputStatus = (function (_super) {
        __extends(CombinedInputStatus, _super);
        function CombinedInputStatus() {
            var _this = _super.call(this, combinedInputStatusId) || this;
            _this._map = {};
            return _this;
        }
        CombinedInputStatus.prototype.get = function (id) {
            return id === this.id ? this : this._map[id];
        };
        Object.defineProperty(CombinedInputStatus.prototype, "nested", {
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
                this._list = list;
                return list;
            },
            enumerable: true,
            configurable: true
        });
        CombinedInputStatus.prototype.add = function (status) {
            if (status.impliedBy(this)) {
                return this;
            }
            this._list = undefined;
            if (status.id !== this.id) {
                var prev = this._map[status.id];
                if (!prev) {
                    this._map[status.id] = status;
                }
                else {
                    var merged = prev.mergeValues(status);
                    if (!merged.impliedBy(this)) {
                        this._map[status.id] = merged;
                    }
                }
            }
            for (var _i = 0, _a = status.nested; _i < _a.length; _i++) {
                var st = _a[_i];
                this.add(st);
            }
            return this;
        };
        CombinedInputStatus.prototype.equalValues = function (status) {
            return nestedMapContainsAll(this._map, status._map) && mapContainsKeys(status._map, this._map);
        };
        CombinedInputStatus.prototype.merge = function (status) {
            return _super.prototype.merge.call(this, status);
        };
        CombinedInputStatus.prototype.mergeValues = function (status) {
            return new CombinedInputStatus().add(this).add(status);
        };
        CombinedInputStatus.prototype.optimize = function () {
            var nested = this.nested;
            if (nested.length <= 1) {
                if (!nested.length) {
                    return exports.InputReady;
                }
                return nested[0];
            }
            return this;
        };
        return CombinedInputStatus;
    }(InputStatus));
    function nestedMapContainsAll(map, other) {
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                if (!map[key].equals(other[key])) {
                    return false;
                }
            }
        }
        return true;
    }
    var inputReadinessId = "__readiness__";
    var InputReadiness = (function (_super) {
        __extends(InputReadiness, _super);
        function InputReadiness(_ready) {
            var _this = _super.call(this, inputReadinessId) || this;
            _this._ready = _ready;
            return _this;
        }
        Object.defineProperty(InputReadiness.prototype, "ready", {
            get: function () {
                return this._ready;
            },
            enumerable: true,
            configurable: true
        });
        InputReadiness.prototype.impliedBy = function (status) {
            return this.ready === status.ready;
        };
        InputReadiness.prototype.equalValues = function (status) {
            return this._ready === status._ready;
        };
        InputReadiness.prototype.mergeValues = function (status) {
            return this.ready ? status : this;
        };
        return InputReadiness;
    }(InputStatus));
    /**
     * Ready for submit input status.
     */
    exports.InputReady = new InputReadiness(true);
    /**
     * Not ready for submit input status.
     */
    exports.InputNotReady = new InputReadiness(false);
    /**
     * Constructs input status control.
     *
     * The control instance will be available via `InputStatus.control` field.
     *
     * When merged with another input status the control value would be preserved, unless another input status represents
     * another control. In the latter case the control status would be dropped from merged status.
     *
     * @param control a control which status should be represented.
     */
    function inputStatusControl(control) {
        return new InputStatusControl(control);
    }
    exports.inputStatusControl = inputStatusControl;
    var inputStatusControlId = "__control__";
    var InputStatusControl = (function (_super) {
        __extends(InputStatusControl, _super);
        function InputStatusControl(_control) {
            var _this = _super.call(this, inputStatusControlId) || this;
            _this._control = _control;
            return _this;
        }
        Object.defineProperty(InputStatusControl.prototype, "control", {
            get: function () {
                return this._control;
            },
            enumerable: true,
            configurable: true
        });
        InputStatusControl.prototype.impliedBy = function (status) {
            return !this.control || this.control === status.control;
        };
        InputStatusControl.prototype.equalValues = function (status) {
            return this._control === status._control;
        };
        InputStatusControl.prototype.mergeValues = function (status) {
            if (!status._control || this._control === status._control) {
                return this;
            }
            if (!this._control) {
                return status;
            }
            return noInputStatusControl;
        };
        return InputStatusControl;
    }(InputStatus));
    var noInputStatusControl = new InputStatusControl(undefined);
    /**
     * Constructs input errors.
     *
     * The `errors` map will be available via `InputStatus.errors` field.
     *
     * @param errors a error map.
     */
    function inputErrors(errors) {
        return new InputErrors(errors);
    }
    exports.inputErrors = inputErrors;
    var inputErrorsId = "__errors__";
    var InputErrors = (function (_super) {
        __extends(InputErrors, _super);
        function InputErrors(_errors) {
            var _this = _super.call(this, inputErrorsId) || this;
            _this._errors = _errors;
            return _this;
        }
        Object.defineProperty(InputErrors.prototype, "errors", {
            get: function () {
                return this._errors;
            },
            enumerable: true,
            configurable: true
        });
        InputErrors.prototype.equalValues = function (status) {
            return equalMaps(this._errors, status._errors);
        };
        InputErrors.prototype.mergeValues = function (status) {
            if (this._errors === status._errors) {
                return this;
            }
            var errors = {};
            for (var key in this._errors) {
                if (this._errors.hasOwnProperty(key)) {
                    errors[key] = this._errors[key];
                }
            }
            for (var key in status._errors) {
                if (status._errors.hasOwnProperty(key)) {
                    errors[key] = status._errors[key];
                }
            }
            return new InputErrors(errors);
        };
        return InputErrors;
    }(InputStatus));
    function equalMaps(map1, map2) {
        return mapContainsAll(map1, map2) && mapContainsKeys(map2, map1);
    }
    function mapContainsKeys(map, other) {
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                if (!other.hasOwnProperty(key)) {
                    return false;
                }
            }
        }
        return true;
    }
    function mapContainsAll(map, other) {
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                if (map[key] !== other[key]) {
                    return false;
                }
            }
        }
        return true;
    }
});
define("src/model", ["require", "exports", "@angular/core", "src/input-status"], function (require, exports, core_1, input_status_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Submittable interface.
     *
     * Submittables (e.g. form inputs) could be submitted at once via {{SubmitService}}.
     *
     * Submittable is responsible for its input status indication and updates.
     */
    var Submittable = (function () {
        function Submittable() {
        }
        Object.defineProperty(Submittable.prototype, "ready", {
            /**
             * Whether this submittable is ready to be submitted.
             *
             * @return {boolean} the value of `.inputStatus.ready` field.
             */
            get: function () {
                return this.inputStatus.ready;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Submittable.prototype, "errors", {
            /**
             * An errors associated with this submittable.
             *
             * @return {{}|undefined} the value of `.inputStatus.errors` field.
             */
            get: function () {
                return this.inputStatus.errors;
            },
            enumerable: true,
            configurable: true
        });
        return Submittable;
    }());
    exports.Submittable = Submittable;
    /**
     * A utility registry implementation.
     */
    var Registry = (function () {
        function Registry() {
            this.changes = new core_1.EventEmitter();
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
    exports.Registry = Registry;
    var resolved = Promise.resolve();
    /**
     * A group of submittables represented as one submittable.
     *
     * The submittables could be added to the group with `addSubmittable()` methods.
     *
     * The input status of this group is combined from the added submittables' input statuses with `InputStatus.merge()`
     * method.
     *
     * This is a base class for concrete injectable service implementations. It is also used as a provider token.
     */
    var SubmitGroup = (function (_super) {
        __extends(SubmitGroup, _super);
        function SubmitGroup() {
            var _this = _super.call(this) || this;
            _this.inputStatusChange = new core_1.EventEmitter();
            _this._registry = new Registry();
            _this._inputStatus = input_status_1.InputReady;
            return _this;
        }
        Object.defineProperty(SubmitGroup.prototype, "inputStatus", {
            get: function () {
                return this._inputStatus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SubmitGroup.prototype, "submittableChanges", {
            /**
             * An event emitter reporting on submittable list changes, i.e. submittable additions or removals.
             *
             * @return {EventEmitter<Submittable[]>}
             */
            get: function () {
                return this._registry.changes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SubmitGroup.prototype, "submittables", {
            /**
             * Submittables added to this group.
             *
             * @return {Submittable[]} an array of submittables.
             */
            get: function () {
                return this._registry.list;
            },
            enumerable: true,
            configurable: true
        });
        SubmitGroup.prototype.updateInputStatus = function (_a) {
            var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
            var status = this.submittables.reduce(function (combined, s) { return combined.merge(s.updateInputStatus({ emitEvents: false })); }, input_status_1.InputReady);
            this.setInputStatus(status, { emitEvents: emitEvents });
            return status;
        };
        SubmitGroup.prototype.setInputStatus = function (status, _a) {
            var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
            if (this._inputStatus.equals(status)) {
                return;
            }
            this._inputStatus = status;
            if (emitEvents !== false) {
                this.inputStatusChange.emit(status);
            }
        };
        /**
         * Adds submittable to this group.
         *
         * The addition would be reported by `submittableChanges` event emitter.
         *
         * @param submittable a submittable to add.
         *
         * @return {RegistryHandle} a handle that can be used to remove the `submittable` from this group. The removal
         * would be reported by `submittableChanges` event emitter.
         */
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
                    _this.updateInputStatus();
                }
            });
            this.updateInputStatus();
            subscr = submittable.inputStatusChange.subscribe(function () { return resolved.then(function () { return _this.updateInputStatus(); }); });
            return handle;
        };
        SubmitGroup.prototype.registerSubmittable = function (_submittable) {
            return {
                unregister: function () { }
            };
        };
        return SubmitGroup;
    }(Submittable));
    exports.SubmitGroup = SubmitGroup;
    /**
     * Input service.
     *
     * An input service is registered by {{InputDirective}} to group one or more input fields.
     */
    var InputService = (function (_super) {
        __extends(InputService, _super);
        function InputService() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return InputService;
    }(SubmitGroup));
    exports.InputService = InputService;
    /**
     * Submit service.
     *
     * A submit service is registered alongside Angular forms by {{SubmitReadyDirective}}. The input fields are added
     * to this service automatically (either directly, or by {{InputService}}). It can be used to submit such forms when
     * they are ready.
     */
    var SubmitService = (function (_super) {
        __extends(SubmitService, _super);
        function SubmitService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._submitted = false;
            return _this;
        }
        Object.defineProperty(SubmitService.prototype, "submitted", {
            /**
             * Whether an attempt to submit this form were performed.
             *
             * @return {boolean} `true` if `.submit()` method is called.
             */
            get: function () {
                return this._submitted;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Resets a submitted flag.
         */
        SubmitService.prototype.resetSubmitted = function () {
            this._submitted = false;
        };
        return SubmitService;
    }(SubmitGroup));
    exports.SubmitService = SubmitService;
});
define("src/submit-ready.directive", ["require", "exports", "@angular/core", "src/model"], function (require, exports, core_2, model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SubmitReadyDirective = SubmitReadyDirective_1 = (function (_super) {
        __extends(SubmitReadyDirective, _super);
        function SubmitReadyDirective() {
            var _this = _super.call(this) || this;
            _this.preSubmit = new core_2.EventEmitter();
            _this.submitReady = new core_2.EventEmitter();
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
    }(model_1.SubmitService));
    __decorate([
        core_2.Output(),
        __metadata("design:type", Object)
    ], SubmitReadyDirective.prototype, "preSubmit", void 0);
    __decorate([
        core_2.Output(),
        __metadata("design:type", Object)
    ], SubmitReadyDirective.prototype, "submitReady", void 0);
    __decorate([
        core_2.HostListener('ngSubmit'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], SubmitReadyDirective.prototype, "onSubmit", null);
    SubmitReadyDirective = SubmitReadyDirective_1 = __decorate([
        core_2.Directive({
            selector: 'form:not([ngNoForm]),ngForm,[ngForm],[formGroup]:not([noSubmitGroup])',
            exportAs: "frexSubmit",
            providers: [
                {
                    provide: model_1.SubmitService,
                    useExisting: core_2.forwardRef(function () { return SubmitReadyDirective_1; }),
                },
                {
                    provide: model_1.SubmitGroup,
                    useExisting: model_1.SubmitService,
                },
            ]
        }),
        __metadata("design:paramtypes", [])
    ], SubmitReadyDirective);
    exports.SubmitReadyDirective = SubmitReadyDirective;
    var SubmitReadyDirective_1;
});
define("src/non-blank.directive", ["require", "exports", "@angular/forms", "@angular/core"], function (require, exports, forms_1, core_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            return this.nonBlank ? forms_1.Validators.required(c) : null;
        };
        NonBlankDirective.prototype.registerOnValidatorChange = function (fn) {
            this._onChange = fn || NOOP;
        };
        return NonBlankDirective;
    }());
    __decorate([
        core_3.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], NonBlankDirective.prototype, "nonBlank", null);
    NonBlankDirective = NonBlankDirective_1 = __decorate([
        core_3.Directive({
            selector: '[nonBlank]',
            providers: [
                {
                    provide: forms_1.NG_VALIDATORS,
                    useExisting: core_3.forwardRef(function () { return NonBlankDirective_1; }),
                    multi: true,
                }
            ],
        })
    ], NonBlankDirective);
    exports.NonBlankDirective = NonBlankDirective;
    var NonBlankDirective_1;
});
define("src/repeat-of.directive", ["require", "exports", "@angular/core", "@angular/forms"], function (require, exports, core_4, forms_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VALID = null;
    var NOOP = function () { };
    var RepeatOfDirective = RepeatOfDirective_1 = (function () {
        function RepeatOfDirective(_injector) {
            this._injector = _injector;
            this._onChange = NOOP;
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
                return VALID;
            }
            if (control.value == null || control.value === "") {
                return VALID;
            }
            if (control.value == this._repeatOf.value) {
                return VALID;
            }
            return { "repeat": "Values don't match" };
        };
        RepeatOfDirective.prototype.registerOnValidatorChange = function (fn) {
            this._onChange = fn || NOOP;
        };
        RepeatOfDirective.prototype.ngOnDestroy = function () {
            this.unsubscribe();
        };
        RepeatOfDirective.prototype.subscribe = function () {
            if (!this._repeatOf) {
                return;
            }
            var control = this._injector.get(forms_2.NgControl).control;
            var repeatOfControl = this._repeatOf.control;
            if (control && repeatOfControl) {
                this._repeatOfSubscr = repeatOfControl.valueChanges.subscribe(function (value) { return control.updateValueAndValidity(); });
            }
        };
        RepeatOfDirective.prototype.unsubscribe = function () {
            if (this._repeatOfSubscr) {
                this._repeatOfSubscr.unsubscribe();
                this._repeatOfSubscr = undefined;
            }
        };
        return RepeatOfDirective;
    }());
    __decorate([
        core_4.Input(),
        __metadata("design:type", forms_2.AbstractControlDirective),
        __metadata("design:paramtypes", [forms_2.AbstractControlDirective])
    ], RepeatOfDirective.prototype, "repeatOf", null);
    RepeatOfDirective = RepeatOfDirective_1 = __decorate([
        core_4.Directive({
            selector: '[repeatOf]',
            providers: [
                {
                    provide: forms_2.NG_VALIDATORS,
                    useExisting: core_4.forwardRef(function () { return RepeatOfDirective_1; }),
                    multi: true,
                }
            ],
        }),
        __metadata("design:paramtypes", [core_4.Injector])
    ], RepeatOfDirective);
    exports.RepeatOfDirective = RepeatOfDirective;
    var RepeatOfDirective_1;
});
define("src/input.directive", ["require", "exports", "@angular/core", "src/model"], function (require, exports, core_5, model_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    }(model_2.InputService));
    InputDirective = InputDirective_1 = __decorate([
        core_5.Directive({
            selector: '[inputStatus],[inputGroup]',
            exportAs: "frexInput",
            providers: [
                {
                    provide: model_2.InputService,
                    useExisting: core_5.forwardRef(function () { return InputDirective_1; }),
                },
                {
                    provide: model_2.SubmitGroup,
                    useExisting: model_2.InputService,
                },
            ]
        }),
        __metadata("design:paramtypes", [model_2.SubmitService])
    ], InputDirective);
    exports.InputDirective = InputDirective;
    var InputDirective_1;
});
define("src/input-control.directive", ["require", "exports", "@angular/core", "@angular/forms", "src/model", "src/input-status", "src/input-status"], function (require, exports, core_6, forms_3, model_3, input_status_2, input_status_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InputControlDirective = (function (_super) {
        __extends(InputControlDirective, _super);
        function InputControlDirective(_control, _submitGroup, _submitService) {
            var _this = _super.call(this) || this;
            _this._control = _control;
            _this._submitGroup = _submitGroup;
            _this._submitService = _submitService;
            _this.inputStatusChange = new core_6.EventEmitter();
            _this._inputStatus = input_status_2.InputReady;
            return _this;
        }
        Object.defineProperty(InputControlDirective.prototype, "inputStatus", {
            get: function () {
                return this._inputStatus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputControlDirective.prototype, "control", {
            get: function () {
                return this._control.control || undefined;
            },
            enumerable: true,
            configurable: true
        });
        InputControlDirective.prototype.updateInputStatus = function (_a) {
            var _b = (_a === void 0 ? {} : _a).emitEvents, emitEvents = _b === void 0 ? true : _b;
            var status = input_status_3.inputStatusControl(this.control);
            status = this.addReadiness(status);
            status = this.addErrors(status);
            if (!status.equals(this._inputStatus)) {
                this._inputStatus = status;
                if (emitEvents !== false) {
                    this.inputStatusChange.emit(status);
                }
            }
            return status;
        };
        InputControlDirective.prototype.addReadiness = function (status) {
            var control = this.control;
            if (!control) {
                return status.merge(input_status_2.InputReady);
            }
            var affected = control.dirty || !this._submitService || this._submitService.submitted;
            var ready = !(control.invalid && affected);
            return status.merge(ready ? input_status_2.InputReady : input_status_2.InputNotReady);
        };
        InputControlDirective.prototype.addErrors = function (status) {
            var control = this.control;
            if (!control) {
                return status;
            }
            var errors = control.errors;
            if (errors) {
                return status.merge(input_status_2.inputErrors(errors));
            }
            return status;
        };
        InputControlDirective.prototype.ngOnInit = function () {
            var _this = this;
            this._preSubmitSubscr =
                this._submitService && this._submitService.preSubmit.subscribe(function () { return _this.updateInputStatus(); });
            var control = this.control;
            if (control) {
                this._stateSubscr = control.statusChanges.subscribe(function () { return _this.updateInputStatus(); });
            }
            this.updateInputStatus({ emitEvents: false });
            this._regHandle = this._submitGroup && this._submitGroup.addSubmittable(this);
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
        return InputControlDirective;
    }(model_3.Submittable));
    InputControlDirective = __decorate([
        core_6.Directive({
            selector: '[ngModel],[formControl],[formControlName]'
        }),
        __param(0, core_6.Host()),
        __param(1, core_6.Optional()),
        __param(2, core_6.Optional()),
        __metadata("design:paramtypes", [forms_3.NgControl,
            model_3.SubmitGroup,
            model_3.SubmitService])
    ], InputControlDirective);
    exports.InputControlDirective = InputControlDirective;
});
define("src/input-errors.component", ["require", "exports", "@angular/core", "src/model"], function (require, exports, core_7, model_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    var resolved = Promise.resolve();
    var InputErrorsComponent = (function () {
        function InputErrorsComponent(_submitGroup) {
            this._submitGroup = _submitGroup;
            this._errors = [];
            this.inputErrorsMap = {};
        }
        Object.defineProperty(InputErrorsComponent.prototype, "hasErrors", {
            get: function () {
                return !this._submitGroup.inputStatus.ready && this.errors.length > 0;
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
            this._subscription = this._submitGroup.submittableChanges.subscribe(function (submittables) { return _this.updateSubmittables(submittables); });
            this.updateSubmittables(this._submitGroup.submittables);
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
        InputErrorsComponent.prototype.updateSubmittables = function (submittables) {
            var _this = this;
            var updateErrors = function () { return resolved.then(function () {
                _this._errors.splice(0);
                submittables.forEach(function (submittable) {
                    var errors = submittable.inputStatus.errors;
                    if (errors) {
                        for (var key in errors) {
                            if (errors.hasOwnProperty(key)) {
                                var message = _this.errorMessage(submittable, key, errors[key]);
                                if (message != null) {
                                    _this._errors.push({ key: key, message: message });
                                }
                            }
                        }
                    }
                });
            }); };
            submittables.forEach(function (s) { return s.inputStatusChange.subscribe(updateErrors); });
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
        return InputErrorsComponent;
    }());
    __decorate([
        core_7.Input(),
        __metadata("design:type", Object)
    ], InputErrorsComponent.prototype, "inputErrorsMap", void 0);
    InputErrorsComponent = __decorate([
        core_7.Component({
            selector: 'input-errors,[inputErrors],[inputErrorsMap]',
            template: "\n    <ng-container *ngIf=\"hasErrors\">\n        <p *ngFor=\"let error of errors; trackBy: trackError\" class=\"text-danger\">{{error.message}}</p>\n        </ng-container>\n    ",
            host: {
                '[class.frex-errors]': 'true',
                '[class.frex-no-errors]': '!hasErrors',
            }
        }),
        __param(0, core_7.Optional()),
        __metadata("design:paramtypes", [model_4.SubmitGroup])
    ], InputErrorsComponent);
    exports.InputErrorsComponent = InputErrorsComponent;
    function errorMessage(submittable, value, message) {
        if (message == null) {
            return undefined;
        }
        if (typeof message === "string") {
            return message;
        }
        return message(value, submittable);
    }
});
define("src/input-status.directive", ["require", "exports", "@angular/core", "src/model"], function (require, exports, core_8, model_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InputStatusDirective = (function () {
        function InputStatusDirective(_inputService) {
            this._inputService = _inputService;
        }
        Object.defineProperty(InputStatusDirective.prototype, "invalid", {
            get: function () {
                return !this._inputService.inputStatus.ready;
            },
            enumerable: true,
            configurable: true
        });
        return InputStatusDirective;
    }());
    __decorate([
        core_8.HostBinding("class.has-error"),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], InputStatusDirective.prototype, "invalid", null);
    InputStatusDirective = __decorate([
        core_8.Directive({
            selector: '[inputStatus]',
        }),
        __metadata("design:paramtypes", [model_5.InputService])
    ], InputStatusDirective);
    exports.InputStatusDirective = InputStatusDirective;
});
define("public_api", ["require", "exports", "@angular/common", "@angular/core", "@angular/forms", "src/submit-ready.directive", "src/non-blank.directive", "src/repeat-of.directive", "src/input.directive", "src/input-control.directive", "src/input-errors.component", "src/input-status.directive", "src/input.directive", "src/input-control.directive", "src/input-errors.component", "src/input-status", "src/input-status.directive", "src/model", "src/non-blank.directive", "src/repeat-of.directive", "src/submit-ready.directive"], function (require, exports, common_1, core_9, forms_4, submit_ready_directive_1, non_blank_directive_1, repeat_of_directive_1, input_directive_1, input_control_directive_1, input_errors_component_1, input_status_directive_1, input_directive_2, input_control_directive_2, input_errors_component_2, input_status_4, input_status_directive_2, model_6, non_blank_directive_2, repeat_of_directive_2, submit_ready_directive_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(input_directive_2);
    __export(input_control_directive_2);
    __export(input_errors_component_2);
    __export(input_status_4);
    __export(input_status_directive_2);
    __export(model_6);
    __export(non_blank_directive_2);
    __export(repeat_of_directive_2);
    __export(submit_ready_directive_2);
    var FormsExtraModule = (function () {
        function FormsExtraModule() {
        }
        return FormsExtraModule;
    }());
    FormsExtraModule = __decorate([
        core_9.NgModule({
            imports: [
                common_1.CommonModule,
                forms_4.FormsModule,
            ],
            declarations: [
                submit_ready_directive_1.SubmitReadyDirective,
                non_blank_directive_1.NonBlankDirective,
                repeat_of_directive_1.RepeatOfDirective,
                input_directive_1.InputDirective,
                input_control_directive_1.InputControlDirective,
                input_errors_component_1.InputErrorsComponent,
                input_status_directive_1.InputStatusDirective,
            ],
            exports: [
                forms_4.FormsModule,
                submit_ready_directive_1.SubmitReadyDirective,
                non_blank_directive_1.NonBlankDirective,
                repeat_of_directive_1.RepeatOfDirective,
                input_directive_1.InputDirective,
                input_control_directive_1.InputControlDirective,
                input_errors_component_1.InputErrorsComponent,
                input_status_directive_1.InputStatusDirective,
            ]
        })
    ], FormsExtraModule);
    exports.FormsExtraModule = FormsExtraModule;
});
