import { EventEmitter } from "@angular/core";
export var InputService = (function () {
    function InputService() {
        this.controlChanges = new EventEmitter();
        this.readyStateChanges = new EventEmitter();
    }
    return InputService;
}());
//# sourceMappingURL=input.service.js.map