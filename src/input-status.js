var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
export var InputStatus = (function () {
    function InputStatus(_id) {
        this._id = _id;
    }
    Object.defineProperty(InputStatus.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputStatus.prototype, "nested", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputStatus.prototype, "ready", {
        get: function () {
            var readiness = this.get(inputReadinessId);
            return readiness == null || readiness.ready;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputStatus.prototype, "errors", {
        get: function () {
            var errors = this.get(inputErrorsId);
            return errors && errors.errors;
        },
        enumerable: true,
        configurable: true
    });
    InputStatus.prototype.get = function (id) {
        return id === this.id ? this : undefined;
    };
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
    InputStatus.prototype.merge = function (status) {
        if (this.id === status.id && !this.nested.length && !status.nested.length) {
            return this.mergeValues(status);
        }
        return this.combine().add(status);
    };
    InputStatus.prototype.combine = function () {
        return new CombinedInputStatus().add(this);
    };
    return InputStatus;
}());
var combinedInputStatusId = "__combined__";
var CombinedInputStatus = (function (_super) {
    __extends(CombinedInputStatus, _super);
    function CombinedInputStatus() {
        _super.call(this, combinedInputStatusId);
        this._map = {};
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
        this._list = undefined;
        if (status.id !== this.id) {
            var prev = this._map[status.id];
            if (!prev) {
                this._map[status.id] = status;
            }
            else {
                this._map[status.id] = prev.mergeValues(status);
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
        _super.call(this, inputReadinessId);
        this._ready = _ready;
    }
    Object.defineProperty(InputReadiness.prototype, "ready", {
        get: function () {
            return this._ready;
        },
        enumerable: true,
        configurable: true
    });
    InputReadiness.prototype.equalValues = function (status) {
        return this._ready === status._ready;
    };
    InputReadiness.prototype.mergeValues = function (status) {
        return this.ready ? status : this;
    };
    return InputReadiness;
}(InputStatus));
export var InputReady = new InputReadiness(true);
export var InputNotReady = new InputReadiness(false);
var inputErrorsId = "__errors__";
export var InputErrors = (function (_super) {
    __extends(InputErrors, _super);
    function InputErrors(_errors) {
        _super.call(this, inputErrorsId);
        this._errors = _errors;
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
//# sourceMappingURL=input-status.js.map