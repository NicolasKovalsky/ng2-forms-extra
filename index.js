import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SubmitReadyDirective } from "./src/submit-ready.directive";
import { NonBlankDirective } from "./src/non-blank.directive";
import { RepeatOfDirective } from "./src/repeat-of.directive";
import { InputDirective } from "./src/input.directive";
import { InputControlDirective } from "./src/input-control.directive";
import { InputErrorsComponent } from "./src/input-errors.component";
import { InputStatusDirective } from "./src/input-status.directive";
export * from "./src/input.directive";
export * from "./src/input-control.directive";
export * from "./src/input-errors.component";
export * from "./src/input-status";
export * from "./src/input-status.directive";
export * from "./src/model";
export * from "./src/non-blank.directive";
export * from "./src/repeat-of.directive";
export * from "./src/submit-ready.directive";
var FormsExtraModule = (function () {
    function FormsExtraModule() {
    }
    return FormsExtraModule;
}());
export { FormsExtraModule };
FormsExtraModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule,
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
                    FormsModule,
                    SubmitReadyDirective,
                    NonBlankDirective,
                    RepeatOfDirective,
                    InputDirective,
                    InputControlDirective,
                    InputErrorsComponent,
                    InputStatusDirective,
                ]
            },] },
];
/** @nocollapse */
FormsExtraModule.ctorParameters = function () { return []; };
//# sourceMappingURL=index.js.map