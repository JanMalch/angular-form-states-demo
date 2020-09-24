import {Component, DoCheck, Injectable, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {merge, Observable, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ErrorStateMatcherOptions} from '../models';

@Injectable()
class DynamicErrorStateMatcher implements ErrorStateMatcher {
  options: ErrorStateMatcherOptions | null = null;

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (control == null || form == null) {
      throw new Error('Control and form should not be null'); // just for demo
    }
    if (!control.invalid) { // disabled controls are not valid, but are !invalid
      return false;
    }
    if (this.options == null || this.options.immediate) {
      return control.invalid;
    }
    return (control.dirty && this.options.useControlDirty) ||
      (control.touched && this.options.useControlTouched) ||
      (form.dirty && this.options.useFormDirty) ||
      (form.touched && this.options.useFormTouched) ||
      (form.submitted && this.options.useFormSubmitted);
  }
}

@Component({
  selector: 'app-editor[options]',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    DynamicErrorStateMatcher,
    {provide: ErrorStateMatcher, useExisting: DynamicErrorStateMatcher},
  ]
})
export class EditorComponent implements OnInit, DoCheck {

  @Input() options: ErrorStateMatcherOptions;

  formGroup: FormGroup;
  formState$: Observable<Record<string, string | boolean>>;
  firstNameState$: Observable<Record<string, any>>;
  lastNameState$: Observable<Record<string, any>>;
  emailState$: Observable<Record<string, any>>;
  cityState$: Observable<Record<string, any>>;
  countryState$: Observable<Record<string, any>>;

  private doCheck$ = new Subject();

  constructor(private fb: FormBuilder,
              private desm: DynamicErrorStateMatcher,
              private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.desm.options = this.options;
    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email]],
      country: ['', { validators: [Validators.minLength(3)], updateOn: 'blur' }],
      city: this.fb.control({value: 'Angular city', disabled: true})
    });

    this.formState$ = this.formGroup.valueChanges.pipe(
      startWith(undefined),
      map(() => {
        return {
          status: this.formGroup.status,
          touched: this.formGroup.touched,
          dirty: this.formGroup.dirty,
          valid: this.formGroup.valid,
          invalid: this.formGroup.invalid,
        };
      })
    );
    this.firstNameState$ = this.observeStateOf(this.formGroup.controls.firstName);
    this.lastNameState$ = this.observeStateOf(this.formGroup.controls.lastName);
    this.emailState$ = this.observeStateOf(this.formGroup.controls.email);
    this.cityState$ = this.observeStateOf(this.formGroup.controls.city);
    this.countryState$ = this.observeStateOf(this.formGroup.controls.country);
  }

  ngDoCheck(): void {
    this.doCheck$.next();
    // simple/dirty solution with DoCheck for the demo
    this.adjustImmediateSwitch();
    this.refreshErrorState();
  }

  refreshErrorState(): void {
    this.formGroup.updateValueAndValidity({ onlySelf: false });
  }

  adjustImmediateSwitch(): void {
    const { immediate, ...others} = this.options;
    this.options.immediate = Object.values(others).every(x => x === false);
  }

  private observeStateOf(control: AbstractControl): Observable<Record<string, any>> {
    return merge(this.doCheck$, control.valueChanges, control.statusChanges).pipe(
      startWith(undefined),
      map(() => {
        return {
          status: control.status,
          touched: control.touched,
          dirty: control.dirty,
          valid: control.valid,
          invalid: this.formGroup.invalid,
        };
      })
    );
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.snackBar.open(`✔️ If this was a real application, your form would've been submitted.`, null, {
        duration: 5000,
      });
    }
  }
}
