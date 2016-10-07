import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SubmitReadyDirective} from "./submit-ready.directive";
import {NonBlankDirective} from "./non-blank.directive";
import {RepeatOfDirective} from "./repeat-of.directive";
import {InputDirective} from "./input.directive";
import {InputControlDirective} from "./input-control.directive";
import {InputErrorsComponent} from "./input-errors.component";
import {InputStatusDirective} from "./input-status.directive";

@NgModule({
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
})
export class FormsExtraModule {
}
