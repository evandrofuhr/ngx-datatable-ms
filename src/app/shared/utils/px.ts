import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  // tslint:disable-next-line:pipe-naming
  name: 'px'
})
export class PixelConverter implements PipeTransform {
  public transform(value: string | number, args: string[]): any {
    if (value === undefined) {
      return;
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return value + 'px';
    }
  }
}
