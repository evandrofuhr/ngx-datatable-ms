import { Directive, Input, ContentChild, OnInit, ElementRef } from '@angular/core';
import { DataTableRowComponent } from '../../data-table/data-table-row/data-table-row.component';
import { CellCallback } from '../types/cell-callback.type';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'data-table-column'
})
export class DataTableColumnDirective implements OnInit {

  // init:
  @Input() public header?: string;
  @Input() public sortable = false;
  @Input() public resizable = false;
  @Input() public property?: string;
  @Input() public styleClass?: string;
  @Input() public cellColors?: CellCallback;

  // init and state:
  @Input() public width?: number | string;
  @Input() public visible = true;

  // tslint:disable-next-line:member-access
  @ContentChild('dataTableCell') cellTemplate?: ElementRef;
  // tslint:disable-next-line:member-access
  @ContentChild('dataTableHeader') headerTemplate?: ElementRef;

  private styleClassObject = {}; // for [ngClass]

  public getCellColor(row: DataTableRowComponent, index: number) {
    if (this.cellColors !== undefined) {
      return (this.cellColors as CellCallback)(row.item, row, this, index);
    }
  }

  public ngOnInit() {
    this._initCellClass();
  }

  private _initCellClass() {
    if (!this.styleClass && this.property) {
      if (/^[a-zA-Z0-9_]+$/.test(this.property)) {
        this.styleClass = 'column-' + this.property;
      } else {
        this.styleClass = 'column-' + this.property.replace(/[^a-zA-Z0-9_]/g, '');
      }
    }

    if (this.styleClass != null) {
      this.styleClassObject = {
        [this.styleClass]: true
      };
    }
  }

}
