import {
  Component, Input, Inject, forwardRef, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { DataTableComponent } from '../data-table.component';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: '[dataTableRow]',
  templateUrl: 'data-table-row.component.html',
  styleUrls: ['data-table-row.component.css']
})
export class DataTableRowComponent implements OnDestroy {
  @Input() public item: any;
  @Input() public index: number;
  @Output() public selectedChange = new EventEmitter();
  // tslint:disable-next-line:variable-name
  public _this = this;
  public expanded?: boolean;
  // tslint:disable-next-line:no-forward-ref
  constructor(@Inject(forwardRef(() => DataTableComponent)) public dataTable: DataTableComponent) {
    this.index = 0;
  }

  get selected() {
    return this.item && this.item.selected;
  }

  set selected(selected) {
    this.item.selected = selected;
    this.selectedChange.emit(selected);
  }

  // other:

  get displayIndex() {
    if (this.dataTable.pagination) {
      return (this.dataTable.displayParams.offset || 0) + this.index + 1;
    } else {
      return this.index + 1;
    }
  }

  public getTooltip() {
    if (this.dataTable.rowTooltip) {
      return this.dataTable.rowTooltip(this.item, this, this.index);
    }
    return '';
  }

  public ngOnDestroy() {
    // this.selected = false;
  }
}
