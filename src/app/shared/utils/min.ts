import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  // tslint:disable-next-line:pipe-naming
  name: 'min'
})
export class MinPipe implements PipeTransform {
  public transform(value: number[], args: string[]): any {
    return Math.min.apply(null, value);
  }
}
