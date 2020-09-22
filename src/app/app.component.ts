import {Component, OnInit} from '@angular/core';
import {ErrorStateMatcherOptions} from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  options = this.createOptions();
  private createOptions(): ErrorStateMatcherOptions {
    return {
      useControlDirty: true,
      useControlTouched: false,
      useFormDirty: false,
      useFormTouched: false,
      useFormSubmitted: false,
      immediate: false
    };
  }
}
