var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EventEmitter } from "@angular/core";
import { InputReady } from "./input-status";
export var Submittable = (function () {
    function Submittable() {
    }
    Object.defineProperty(Submittable.prototype, "ready", {
        get: function () {
            return this.inputStatus.ready;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Submittable.prototype, "errors", {
        get: function () {
            return this.inputStatus.errors;
        },
        enumerable: true,
        configurable: true
    });
    return Submittable;
}());
export var Registry = (function () {
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
var resolved = Promise.resolve();
export var SubmitGroup = (function (_super) {
    __extends(SubmitGroup, _super);
    function SubmitGroup() {
        _super.call(this);
        this.inputStatusChange = new EventEmitter();
        this._registry = new Registry();
        this._inputStatus = InputReady;
    }
    Object.defineProperty(SubmitGroup.prototype, "inputStatus", {
        get: function () {
            return this._inputStatus;
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
export var SubmittableControl = (function (_super) {
    __extends(SubmittableControl, _super);
    function SubmittableControl() {
        _super.apply(this, arguments);
    }
    return SubmittableControl;
}(Submittable));
export var InputService = (function (_super) {
    __extends(InputService, _super);
    function InputService() {
        _super.apply(this, arguments);
    }
    return InputService;
}(SubmitGroup));
export var SubmitService = (function (_super) {
    __extends(SubmitService, _super);
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
//# sourceMappingURL=model.js.map