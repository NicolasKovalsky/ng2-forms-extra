var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SubmitReadyDirective } from "./submit-ready.directive";
import { NonBlankDirective } from "./non-blank.directive";
import { RepeatOfDirective } from "./repeat-of.directive";
import { InputDirective } from "./input.directive";
import { InputControlDirective } from "./input-control.directive";
import { InputErrorsComponent } from "./input-errors.component";
import { InputStatusDirective } from "./input-status.directive";
export var FormsExtraModule = (function () {
    function FormsExtraModule() {
    }
    FormsExtraModule = __decorate([
        NgModule({
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
        }), 
        __metadata('design:paramtypes', [])
    ], FormsExtraModule);
    return FormsExtraModule;
}());
//# sourceMappingURL=forms-extra.module.js.map