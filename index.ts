import { DataTableComponent } from './src/data-table/data-table.component';
import { DataTableRowComponent } from './src/data-table/data-table-row/data-table-row.component';
import { DataTableHeaderComponent } from './src/data-table/data-table-header/data-table-header.component';
import { DataTablePaginationComponent } from './src/data-table/data-table-pagination/data-table-pagination.component';
import { DataTableColumnDirective } from './src/shared/directive/data-table-column.directive';
import { CellCallback } from './src/shared/types/cell-callback.type';
import { IDataTableParams } from './src/shared/types/data-table-params.type';
import { IDataTableTranslations } from './src/shared/types/data-table-translations.type';
import { defaultTranslations } from './src/shared/types/default-translations.type';
import { RowCallback } from './src/shared/types/row-callback.type';

export { DataTableModule } from './src/data-table.module';
export * from './src/shared/tools/data-table-resource';
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
