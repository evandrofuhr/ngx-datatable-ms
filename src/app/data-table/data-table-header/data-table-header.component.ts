import { Component, Inject, forwardRef, HostListener } from '@angular/core';
import { DataTableComponent } from '../data-table.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'data-table-header',
  template: 'data-table-header.component.html',
  styleUrls: ['data-table-header.component.css']
})
export class DataTableHeaderComponent {
  public columnSelectorOpen = false;

  // tslint:disable-next-line:no-forward-ref
  constructor(@Inject(forwardRef(() => DataTableComponent)) public dataTable: DataTableComponent) { }

  @HostListener('click') public onClick() {
    this.columnSelectorOpen = false;
  }

}
