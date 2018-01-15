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
var /**
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
InputStatus = /** @class */ (function () {
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
        get: /**
             * An identifier of status object type.
             *
             * @return {string} the identifier passed to constructor.
             */
        function () {
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
        get: /**
             * Nested input status object.
             *
             * @return {Array<InputStatus>} a list of nested input status objects.
             */
        function () {
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
        get: /**
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
        function () {
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
        get: /**
             * Input errors.
             *
             * Input errors could be set with `inputErrors()` method.
             *
             * @return {{}|undefined} a map of input errors, if any.
             */
        function () {
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
        get: /**
             * A control, which status is represented by this status.
             *
             * The control can be set with `inputStatusControl()` method.
             *
             * Note that when the status is merged from multiple controls, this value will be undefined.
             *
             * @return {AbstractControl|undefined} a control instance, if eny.
             */
        function () {
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
    /**
         * An input status object with the given identifier.
         *
         * @param id target identifier.
         *
         * @return {InputStatus} input status which identifier is equal to the given one, if any.
         */
    InputStatus.prototype.get = /**
         * An input status object with the given identifier.
         *
         * @param id target identifier.
         *
         * @return {InputStatus} input status which identifier is equal to the given one, if any.
         */
    function (id) {
        return id === this.id ? this : undefined;
    };
    /**
     * Checks whether this input status is equal to another one.
     *
     * @param status an input status object to compare this one with. If omitted the method will return `false`.
     */
    /**
         * Checks whether this input status is equal to another one.
         *
         * @param status an input status object to compare this one with. If omitted the method will return `false`.
         */
    InputStatus.prototype.equals = /**
         * Checks whether this input status is equal to another one.
         *
         * @param status an input status object to compare this one with. If omitted the method will return `false`.
         */
    function (status) {
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
    /**
         * Checks whether this input status is implied by another one.
         *
         * This method is called to remove unnecessary input statuses from combined ones.
         *
         * @param status another input status to check this one against.
         */
    InputStatus.prototype.impliedBy = /**
         * Checks whether this input status is implied by another one.
         *
         * This method is called to remove unnecessary input statuses from combined ones.
         *
         * @param status another input status to check this one against.
         */
    function (status) {
        return status === this;
    };
    /**
     * Merges two input statuses.
     *
     * @param status an input status to merge this one with.
     *
     * @return {InputStatus} new input status combined from the two ones.
     */
    /**
         * Merges two input statuses.
         *
         * @param status an input status to merge this one with.
         *
         * @return {InputStatus} new input status combined from the two ones.
         */
    InputStatus.prototype.merge = /**
         * Merges two input statuses.
         *
         * @param status an input status to merge this one with.
         *
         * @return {InputStatus} new input status combined from the two ones.
         */
    function (status) {
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
export { InputStatus };
var combinedInputStatusId = "__combined__";
var CombinedInputStatus = /** @class */ (function (_super) {
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
                return InputReady;
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
var InputReadiness = /** @class */ (function (_super) {
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
export var InputReady = new InputReadiness(true);
/**
 * Not ready for submit input status.
 */
export var InputNotReady = new InputReadiness(false);
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
export function inputStatusControl(control) {
    return new InputStatusControl(control);
}
var inputStatusControlId = "__control__";
var InputStatusControl = /** @class */ (function (_super) {
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
export function inputErrors(errors) {
    return new InputErrors(errors);
}
var inputErrorsId = "__errors__";
var InputErrors = /** @class */ (function (_super) {
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
//# sourceMappingURL=C:/Users/info/Desktop/Projects/Smart Warehousing/ng2-forms-extra/src/input-status.js.map