import { DataTableComponent } from './app/data-table/data-table.component';
import { DataTableRowComponent } from './app/data-table/data-table-row/data-table-row.component';
import { DataTableHeaderComponent } from './app/data-table/data-table-header/data-table-header.component';
import { DataTablePaginationComponent } from './app/data-table/data-table-pagination/data-table-pagination.component';
import { DataTableColumnDirective } from './app/shared/directive/data-table-column.directive';
import { CellCallback } from './app/shared/types/cell-callback.type';
import { IDataTableParams } from './app/shared/types/data-table-params.type';
import { IDataTableTranslations } from './app/shared/types/data-table-translations.type';
import { defaultTranslations } from './app/shared/types/default-translations.type';
import { RowCallback } from './app/shared/types/row-callback.type';

export { DataTableModule } from './app/data-table.module';
export * from './app/shared/tools/data-table-resource';
export {
  DataTableComponent,
  DataTableColumnDirective,
  DataTableRowComponent,
  DataTablePaginationComponent,
  IDataTableParams,
  DataTableHeaderComponent,
  IDataTableTranslations,
  CellCallback,
  RowCallback,
  defaultTranslations
};
export const DATA_TABLE_DIRECTIVES = [DataTableComponent, DataTableColumnDirective];
