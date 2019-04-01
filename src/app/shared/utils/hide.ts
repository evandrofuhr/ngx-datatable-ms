import { Directive, ElementRef, Renderer } from '@angular/core';

function isBlank(obj: any): boolean {
  return obj === undefined || obj === null;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[hide]',
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['hide']
})
export class HideDirective {

  // tslint:disable-next-line:variable-name
  private _prevCondition = false;
  // tslint:disable-next-line:variable-name
  private _displayStyle?: string;

  // tslint:disable-next-line:variable-name
  constructor(private _elementRef: ElementRef, private _renderer: Renderer) { }

  set hide(newCondition: boolean) {
    this.initDisplayStyle();

    if (newCondition && (isBlank(this._prevCondition) || !this._prevCondition)) {
      this._prevCondition = true;
      this._renderer.setElementStyle(this._elementRef.nativeElement, 'display', 'none');
    } else if (!newCondition && (isBlank(this._prevCondition) || this._prevCondition)) {
      this._prevCondition = false;
      this._renderer.setElementStyle(this._elementRef.nativeElement, 'display', this._displayStyle || '');
    }
  }

  private initDisplayStyle() {
    if (this._displayStyle === undefined) {
      const displayStyle = this._elementRef.nativeElement.style.display;
      if (displayStyle && displayStyle !== 'none') {
        this._displayStyle = displayStyle;
      }
    }
  }
}
