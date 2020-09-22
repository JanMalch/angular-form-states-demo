import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonPropList'
})
export class JsonPropListPipe implements PipeTransform {

  transform(value: Record<string, any>): string {
    if (!value) {
      return 'null';
    }
    const stringified = JSON.stringify(value, null, 2);
    return stringified.split('\n').slice(1, -1).map(l => l.trim()).join('\n');
  }

}
