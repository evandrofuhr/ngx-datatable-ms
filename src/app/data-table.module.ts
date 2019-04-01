import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataTableComponent } from './data-table/data-table.component';
import { DataTableRowComponent } from './data-table/data-table-row/data-table-row.component';
import { DataTableColumnDirective } from './shared/directive/data-table-column.directive';
import { DataTableHeaderComponent } from './data-table/data-table-header/data-table-header.component';
import { DataTablePaginationComponent } from './data-table/data-table-pagination/data-table-pagination.component';

import { HideDirective } from './shared/utils/hide';
import { MinPipe } from './shared/utils/min';
import { PixelConverter } from './shared/utils/px';

@NgModule({
  declarations: [
    DataTableComponent, DataTableColumnDirective,
    DataTableRowComponent, DataTablePaginationComponent, DataTableHeaderComponent,
    PixelConverter, HideDirective, MinPipe
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    DataTableComponent, DataTableColumnDirective
  ]
})
export class DataTableModule { }
