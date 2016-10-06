export var SubmitService = (function () {
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
//# sourceMappingURL=submit.service.js.map