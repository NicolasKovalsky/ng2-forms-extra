Angular 2 Forms Extra
=====================

This library extends standard Angular forms module with a few useful things:
 
- Improves standard form validation UX.
- Provides more control on form submit process.
- Adds components for displaying validation status and errors.
- Adds few validators.


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


TODO: More documentation to come.
