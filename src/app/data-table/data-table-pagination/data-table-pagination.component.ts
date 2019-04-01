import { Component, Inject, forwardRef } from '@angular/core';
import { DataTableComponent } from '../data-table.component';

@Component({
  moduleId: module.id,
  // tslint:disable-next-line:component-selector
  selector: 'data-table-pagination',
  templateUrl: 'data-table-pagination.component.html',
  styleUrls: ['data-table-pagination.component.css']
})
export class DataTablePaginationComponent {

  public limits: number[] = [2, 5, 10, 25, 50, 100, 250];

  // tslint:disable-next-line:no-forward-ref
  constructor(@Inject(forwardRef(() => DataTableComponent)) public dataTable: DataTableComponent) {
  }

  public pageBack() {
    this.dataTable.offset -= Math.min(this.dataTable.limit, this.dataTable.offset);
  }

  public pageForward() {
    this.dataTable.offset += this.dataTable.limit;
  }

  public pageFirst() {
    this.dataTable.offset = 0;
  }

  public pageLast() {
    this.dataTable.offset = (this.maxPage - 1) * this.dataTable.limit;
  }

  public get maxPage() {
    return Math.ceil(this.dataTable.itemCount / this.dataTable.limit);
  }

  public get limit() {
    return this.dataTable.limit;
  }

  public set limit(value) {
    // TODO better way to handle that value of number <input> is string?
    this.dataTable.limit = Number(value as any);
  }

  public get page() {
    return this.dataTable.page;
  }

  public set page(value) {
    this.dataTable.page = Number(value as any);
  }
}
