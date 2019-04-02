import {
  Component, Input, Output, EventEmitter, ContentChildren, QueryList,
  TemplateRef, ContentChild, ViewChildren, OnInit
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { DataTableColumnDirective } from '../shared/directive/data-table-column.directive';
import { DataTableRowComponent } from './data-table-row/data-table-row.component';
import { IDataTableParams } from '../shared/types/data-table-params.type';
import { RowCallback } from '../shared/types/row-callback.type';
import { IDataTableTranslations } from '../shared/types/data-table-translations.type';
import { defaultTranslations } from '../shared/types/default-translations.type';
import { drag } from '../shared/utils/drag';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'data-table',
  templateUrl: 'data-table.component.html',
  styleUrls: ['data-table.component.css']
})
export class DataTableComponent implements IDataTableParams, OnInit {
  @Input() public itemCount = 0;
  @Input() public headerTitle?: string;
  @Input() public header = true;
  @Input() public pagination = true;
  @Input() public indexColumn = true;
  @Input() public indexColumnHeader = '';
  @Input() public rowColors?: RowCallback;
  @Input() public rowTooltip?: RowCallback;
  @Input() public selectColumn = false;
  @Input() public multiSelect = true;
  @Input() public substituteRows = true;
  @Input() public expandableRows = false;
  @Input() public translations: IDataTableTranslations = defaultTranslations;
  @Input() public selectOnRowClick = false;
  @Input() public autoReload = true;
  @Input() public showReloading = false;
  @Input() public noDataMessage?: string;
  @Input() public additionalClass = '';
  @Input() get items() {
    return this._items;
  }

  set items(items: any[]) {
    this._items = items;
    this._onReloadFinished();
  }
  @Input()
  get params() {
    return this._getRemoteParameters();
  }
  set params(value: IDataTableParams) {
    this._sortBy = value.sortBy;
    this._sortAsc = value.sortAsc;
    this._offset = value.offset || 0;
    this._limit = value.limit || 10;
  }
  @Input()
  get sortBy() {
    return this._sortBy;
  }

  set sortBy(value) {
    const reload = (!this._sortBy && value) || (this._sortBy && !value) || (this._sortBy !== value);
    this._sortBy = value;
    if (reload) {
      this.subject$.next();
    }
  }

  @Input()
  get sortAsc() {
    return this._sortAsc;
  }

  set sortAsc(value) {
    const reload = (!this._sortAsc && value) || (this._sortAsc && !value) || (this._sortAsc !== value);
    this._sortAsc = value;
    if (reload) {
      this.subject$.next();
    }
  }

  @Input()
  get offset() {
    return this._offset;
  }

  set offset(value) {
    const reload = (!this._offset && value) || (this._offset && !value) || (this._offset !== value);
    this._offset = value;
    if (reload) {
      this.subject$.next();
    }
  }

  @Input()
  get limit() {
    return this._limit;
  }
  set limit(value) {
    const reload = (!this._limit && value) || (this._limit && !value) || (this._limit !== value);
    this._limit = value;
    if (reload) {
      this.subject$.next();
    }
  }

  @Input()
  get page() {
    return Math.floor(this.offset / this.limit) + 1;
  }

  set page(value) {
    this.offset = (value - 1) * this.limit;
  }

  get lastPage() {
    return Math.ceil(this.itemCount / this.limit);
  }
  @Output() public reload = new EventEmitter();
  @Output() public rowClick = new EventEmitter();
  @Output() public rowDoubleClick = new EventEmitter();
  @Output() public headerClick = new EventEmitter();
  @Output() public cellClick = new EventEmitter();

  @ViewChildren(DataTableRowComponent) public rows?: QueryList<DataTableRowComponent>;
  @ContentChild('dataTableExpand') public expandTemplate?: TemplateRef<any>;
  @ContentChildren(DataTableColumnDirective) public columns?: QueryList<DataTableColumnDirective>;

  // UI state without input:
  public indexColumnVisible?: boolean;
  public selectColumnVisible?: boolean;
  public expandColumnVisible?: boolean;
  public selectedRow?: DataTableRowComponent;
  public selectedRows: DataTableRowComponent[] = [];
  public resizeLimit = 30;
  // tslint:disable-next-line:variable-name
  public _displayParams = {} as IDataTableParams; // params of the last finished reload
  get displayParams() {
    return this._displayParams;
  }
  // Reloading:
  // tslint:disable-next-line:variable-name
  public _reloading = false;
  get reloading() {
    return this._reloading;
  }
  public subject$ = new Subject<void>();
  public stream$: Observable<void>;

  // tslint:disable-next-line:variable-name
  private _resizeInProgress = false;
  // tslint:disable-next-line:variable-name
  private _items: any[] = [];
  // UI state: visible get/set for the outside with @Input for one-time initial values
  // tslint:disable-next-line:variable-name
  private _sortBy?: string;
  // tslint:disable-next-line:variable-name
  private _sortAsc?: boolean;
  // tslint:disable-next-line:variable-name
  private _offset = 0;
  // tslint:disable-next-line:variable-name
  private _limit = 10;
  // tslint:disable-next-line:variable-name
  private _selectAllCheckbox = false;

  get selectAllCheckbox() {
    return this._selectAllCheckbox;
  }

  set selectAllCheckbox(value) {
    this._selectAllCheckbox = value;
    this._onSelectAllChanged(value);
  }

  constructor() {
    this._sortAsc = true;
    this.stream$ = this.subject$.pipe(
      debounceTime(100)
    );
  }

  // setting multiple observable properties simultaneously
  public sort(sortBy: string, asc: boolean) {
    this.sortBy = sortBy;
    this.sortAsc = asc;
  }

  // init
  public ngOnInit() {
    this._initDefaultValues();
    this._initDefaultClickEvents();
    this._updateDisplayParams();

    if (this.autoReload) {
      this.reloadItems();
    }

    this.stream$.subscribe(() => {
      this.reloadItems();
    });
  }

  public reloadItems() {
    this._reloading = true;
    this.reload.emit(this._getRemoteParameters());
  }

  public _updateDisplayParams() {
    this._displayParams = {
      sortBy: this.sortBy,
      sortAsc: this.sortAsc,
      offset: this.offset,
      limit: this.limit
    };
  }

  public rowClicked(row: DataTableRowComponent, event: Event) {
    this.rowClick.emit({ row, event });
  }

  public rowDoubleClicked(row: DataTableRowComponent, event: Event) {
    this.rowDoubleClick.emit({ row, event });
  }

  public headerClicked(column: DataTableColumnDirective, event: Event) {
    if (!this._resizeInProgress) {
      event.preventDefault();
      event.stopPropagation();
      this.headerClick.emit({ column, event });
    } else {
      this._resizeInProgress = false; // this is because I can't prevent click from mousup of the drag end
    }
  }

  public getRowColor(item: any, index: number, row: DataTableRowComponent) {
    if (this.rowColors !== undefined) {
      return (this.rowColors as RowCallback)(item, row, index);
    }
  }

  public onRowSelectChanged(row: DataTableRowComponent) {
    // maintain the selectedRow(s) view
    if (this.multiSelect) {
      const index = this.selectedRows.indexOf(row);
      if (row.selected && index < 0) {
        this.selectedRows.push(row);
      } else if (!row.selected && index >= 0) {
        this.selectedRows.splice(index, 1);
      }
    } else {
      if (row.selected) {
        this.selectedRow = row;
      } else if (this.selectedRow === row) {
        delete this.selectedRow;
      }
    }

    // unselect all other rows:
    if (row.selected && !this.multiSelect) {
      if (this.rows) {
        // tslint:disable-next-line:variable-name
        this.rows.toArray().filter((row_) => row_.selected).forEach((row_) => {
          if (row_ !== row) { // avoid endless loop
            row_.selected = false;
          }
        });
      }
    }
  }

  private _initDefaultValues() {
    this.indexColumnVisible = this.indexColumn;
    this.selectColumnVisible = this.selectColumn;
    this.expandColumnVisible = this.expandableRows;
  }

  private _initDefaultClickEvents() {
    // tslint:disable-next-line:max-line-length
    this.headerClick.subscribe((tableEvent: { column: DataTableColumnDirective, event: Event }) => this.sortColumn(tableEvent.column));
    if (this.selectOnRowClick) {
      // tslint:disable-next-line:max-line-length
      this.rowClick.subscribe((tableEvent: { row: DataTableRowComponent, event: Event }) => tableEvent.row.selected = !tableEvent.row.selected);
    }
  }

  private _onReloadFinished() {
    this._updateDisplayParams();

    this._selectAllCheckbox = false;
    this._reloading = false;
  }

  private cellClicked(column: DataTableColumnDirective, row: DataTableRowComponent, event: MouseEvent) {
    this.cellClick.emit({ row, column, event });
  }

  private _getRemoteParameters(): IDataTableParams {
    const params = {} as IDataTableParams;

    if (this.sortBy) {
      params.sortBy = this.sortBy;
      params.sortAsc = this.sortAsc;
    }
    if (this.pagination) {
      params.offset = this.offset;
      params.limit = this.limit;
    }
    return params;
  }

  private sortColumn(column: DataTableColumnDirective) {
    if (column.sortable) {
      const ascending = this.sortBy === column.property ? !this.sortAsc : true;
      this.sort(column.property || '', ascending);
    }
  }

  get columnCount() {
    let count = 0;
    count += this.indexColumnVisible ? 1 : 0;
    count += this.selectColumnVisible ? 1 : 0;
    count += this.expandColumnVisible ? 1 : 0;
    if (this.columns) {
      this.columns.toArray().forEach((column) => {
        count += column.visible ? 1 : 0;
      });
    }
    return count;
  }

  private _onSelectAllChanged(value: boolean) {
    if (this.rows) {
      this.rows.toArray().forEach((row) => row.selected = value);
    }
  }

  get substituteItems() {
    return Array.from({ length: (this.displayParams.limit || 0) - this.items.length });
  }

  public resizeColumnStart(event: MouseEvent, column: DataTableColumnDirective, columnElement: HTMLElement) {
    this._resizeInProgress = true;

    drag(event, {
      move: (moveEvent: MouseEvent, dx: number) => {
        if (this._isResizeInLimit(columnElement, dx)) {
          column.width = columnElement.offsetWidth + dx;
        }
      },
    });
  }

  private _isResizeInLimit(columnElement: HTMLElement, dx: number) {
    /* This is needed because CSS min-width didn't work on table-layout: fixed.
    Without the limits, resizing can make the next column disappear completely,
    and even increase the table width. The current implementation suffers from the fact,
    that offsetWidth sometimes contains out-of-date values. */
    if ((dx < 0 && (columnElement.offsetWidth + dx) <= this.resizeLimit) ||
      !columnElement.nextElementSibling || // resizing doesn't make sense for the last visible column
      (dx >= 0 && ((columnElement.nextElementSibling as HTMLElement).offsetWidth + dx) <= this.resizeLimit)) {
      return false;
    }
    return true;
  }
}
