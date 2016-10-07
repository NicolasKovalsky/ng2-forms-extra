var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EventEmitter } from "@angular/core";
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
export var SubmitGroup = (function () {
    function SubmitGroup() {
        this.readyStateChanges = new EventEmitter();
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