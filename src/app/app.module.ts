import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { ErrorMessageResolver, NgxEasyErrorsModule } from 'ngx-easy-errors';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorComponent } from './editor/editor.component';
import { JsonPropListPipe } from './json-props.pipe';

const mffOptions: MatFormFieldDefaultOptions = {
  appearance: 'fill',
};

@Injectable()
export class MyFormErrorResolver extends ErrorMessageResolver {
  resolveErrorMessage(errorKey: string, error: any): string {
    switch (errorKey) {
      case 'min':
        return `Value must be greater than or equal to ${error.min}`;
      case 'max':
        return `Value must be less than or equal to ${error.max}`;
      case 'required':
        return `Value is required`;
      case 'email':
        return `Value must be a valid email address`;
      case 'minlength':
        return `The value's length must be greater than or equal to ${error.requiredLength}`;
      case 'maxlength':
        return `The value's length must be less than or equal to ${error.requiredLength}`;
      case 'pattern':
        return `The value must match the pattern ${error.requiredPattern}`;
      default:
        return `Invalid value (Code: ${errorKey})`;
    }
  }
}

@NgModule({
  declarations: [AppComponent, EditorComponent, JsonPropListPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSnackBarModule,
    NgxEasyErrorsModule.forRoot(MyFormErrorResolver),
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: mffOptions },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
