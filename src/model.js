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
import { EventEmitter } from "@angular/core";
import { InputReady } from "./input-status";
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
export { Submittable };
/**
 * A utility registry implementation.
 */
var Registry = (function () {
    function Registry() {
        this.changes = new EventEmitter();
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
export { Registry };
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
        _this.inputStatusChange = new EventEmitter();
        _this._registry = new Registry();
        _this._inputStatus = InputReady;
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
        var status = this.submittables.reduce(function (combined, s) { return combined.merge(s.updateInputStatus({ emitEvents: false })); }, InputReady);
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
export { SubmitGroup };
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
export { InputService };
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
export { SubmitService };
