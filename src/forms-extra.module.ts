import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SubmitReadyDirective} from "./submit-ready.directive";
import {InputDirective} from "./input.directive";
import {InputStatusDirective} from "./input-status.directive";
import {InputErrorsComponent} from "./input-errors.component";
import {NonBlankDirective} from "./non-blank.directive";
import {RepeatOfDirective} from "./repeat-of.directive";

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
        InputStatusDirective,
        InputErrorsComponent,
    ],
    exports: [
        FormsModule,
        SubmitReadyDirective,
        NonBlankDirective,
        RepeatOfDirective,
        InputDirective,
        InputStatusDirective,
        InputErrorsComponent,
    ]
})
export class FormsExtraModule {
}
