import { DataTableRowComponent } from '../../data-table/data-table-row/data-table-row.component';
import { DataTableColumnDirective } from '../../shared/directive/data-table-column.directive';

// tslint:disable-next-line:max-line-length
export type CellCallback = (item: any, row: DataTableRowComponent, column: DataTableColumnDirective, index: number) => string;
