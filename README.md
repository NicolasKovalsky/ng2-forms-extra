Angular 2 Forms Extra
=====================

This library extends standard Angular forms module with a few useful things:
 
- Improves standard form validation UX.
- Provides more control on form submit process.
- Adds components for displaying validation status and errors.
- Adds few validators.


Usage
-----

To use it import a `FormsExtraModule` to your application:
```typescript
import {NgModule} from "@angular/core";
import {FormsExtraModule} from "ng2-forms-extra";

@NgModule({
    imports: [FormsExtraModule]
})
export class MyModule {
}
```
You'll also need to import Angular `FormsModule` and/or `ReactiveFormsModule`.


Form Validation
---------------

It is possible to indicate a field validation status based on Angular validation results. However, if doing this
straightforward, the user would see validation errors even before he entered any data. This is counter-intuitive.
An attempt to resolve this using only standard Angular API would lead to boilerplate.
 
The forms extra module resolves this issue by indicating validation errors only when user entered some data OR tried
to submit a form. In order this to work the following template could be used:
```typescript
import {Component} from "@angular/core";

@Component({
    template:
    `
    <form (submitReady)="update()" #submit="frexSubmit">
        <div inputStatus>
            <input [(ngModel)]="userInput" nonBlank/>
            <input-errors></input-errors>
        </div>
        <div>
            <button type="submit" [disabled]="!submit.ready">Update</button>
        </div>
    </form>
    `
})
export class MyComponent {
    userInput = "";
    update() {
        // Submit the data
    }
} 
```
The component above would disable an "Update" button only when there are some errors displayed on the screen.
These errors won't appear until user enters something or hits "Update" button. If there are some errors, the `update()`
method won't be invoked, the errors would be highlighted, and the "Update" button would be disabled.


Form Components
---------------

### `SubmitReadyDirective`

This directive is attaches to Angular form and provides a `SubmitService` injectable service instance. It groups
all input fields inside the form. It listens for Angular `(ngSubmit)` event and invokes `SubmitService.submit()`
on attempt to submit the form. A `(submitReady)` event will be emitted by `SubmitService` when all input fields
will be ready.

- **Selector:** `form:not([ngNoForm]),ngForm,[ngForm],[formGroup]`
- **Exported As:** `frexSubmit` - an instance of `SubmitService`
- **Outputs:**
   - `(preSubmit)` - emitted on attempt to submit the form, either by user or programmatically.
   - `(submitReady)` - emitted to submit the form. The client code should listen for this event instead of
     Angular's `(ngSubmit)` one.


### `InputControlDirective`

This directive is attaches to Angular form control, represents it as `Submittable` and registers it in enclosing
`SubmitGroup`, which can be either `SubmitService` (see `SubmitReadyDirective` above), or `InputService`
(see `InputDirective` below).

- **Selector:** `[ngModel],[formControl],[formControlName]`


### `InputDirective`

This directive wraps the enclosed form control(s) (see `InputControlDirective`) and combines their input statuses.
This can be used to indicate validation status or to display validation errors.

- **Selector:** `[inputStatus],[inputGroup]`
- **Exported As:** `frexInput` - an instance of `InputService`

Note that `[inputStatus]` selector also attaches an input validation indicator, while the `[inputGroup]` one does not.


### `InputStatusDirective`

This directive indicates a validation error with CSS class. Note that indicator would only appear when enclosed form
controls are not ready to be submitted. I.e. there are validation errors, and the user entered something in these
controls or tried to submit the form.
   
- **Selector:** `[inputStatus]`

This directive appends a `frex-invalid` CSS class to the element it is attached to to indicate that the enclosed form
control(s) are not ready to be submitted.

This can be used e.g. the same way as `has-errors` CSS class from Twitter Bootstrap.


### `InputErrorsComponent`

This component displays validation errors from enclosing `SubmitGroup`, which is typically provided by enclosing
`InputDirective`.

- **Selector:** `input-errors,[inputErrors],[inputErrorsMap]`
- **Inputs:** `[inputErrorsMap]` - a map with form control validation error keys, and strings (or string functions with
  error value and `Submittable` parameters) to display when corresponding validation error occurred.

There are some predefined error messages defined for standard validators like `required`, `minlength`, and `maxlength`.

The generated HTML would look like this:
```HTML
<any-tag class="frex-errors">
    <ul class="frex-error-list">
        <li class="frex-error">Error message</li>
        <li class="frex-error">Another error message</li>
        ...
    </ul>
</any-tag>
```

When there are no errors to report the HTML would look like this:
```HTML
<any-tag class="frex-errors frex-no-errors"></any-tag>
```


Validators
----------

The form extensions contain additional control validation directives.
 
### `NonBlankDirective`

This is the same as `required`, but it does not set the `required` HTML attribute. This prevents standard browser alerts
from appearing when attempt to submit the form. Instead an input validation indicators could be used.

- **Selector:** `[nonBlank]`


### `RepeatOfDirective`

This directive requires the input control value to be equal to another control's value.

- **Selector:** `[repeatOf]`

This directive could be used e.g. to implement password and confirmation controls:
```
<div inputStatus>
    <label>Password:</label>
    <input type="password" name="password" [(ngModel)]="password" #pwd="ngModel"/>
    <input-errors></input-errors>
</div>
<div inputStatus>
    <label>Confirm:</label>
    <input type="password" name="confirmPassword" [(ngModel)]="confirmPassword" [repeatOf]="pwd"/>
    <input-errors></input-errors>
</div>
```
