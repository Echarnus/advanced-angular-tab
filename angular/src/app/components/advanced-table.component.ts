import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './ui/button.component';
import { TableColumn, TableProps, SortState } from '../types/table.types';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div [class]="'relative w-full ' + (className || '')">
      <!-- Loading overlay -->
      <div *ngIf="loading" class="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
        <div class="text-muted-foreground">Loading data...</div>
      </div>

      <!-- Table container with scroll -->
      <div class="relative overflow-auto border rounded-lg" [style.max-height]="scroll?.y">
        <table class="w-full caption-bottom text-sm">
          <!-- Header -->
          <thead [class]="sticky ? 'sticky top-0 z-20' : ''" class="bg-muted/50">
            <tr class="border-b transition-colors hover:bg-muted/50">
              <!-- Expand column -->
              <th *ngIf="expandable" class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                <div class="flex items-center justify-center">
                  <span class="text-xs">Expand</span>
                </div>
              </th>
              
              <!-- Data columns -->
              <th *ngFor="let column of columns; trackBy: trackByColumn"
                  [class]="getHeaderClasses(column)"
                  [style.width]="column.width"
                  [style.min-width]="column.minWidth" 
                  [style.max-width]="column.maxWidth">
                <div [class]="column.sortable ? 'flex items-center justify-between cursor-pointer' : 'flex items-center'"
                     (click)="column.sortable ? handleSort(column.key) : null">
                  <div class="flex items-center">
                    <span>{{ column.title }}</span>
                  </div>
                  <div *ngIf="column.sortable" class="flex flex-col ml-2">
                    <!-- Sort up arrow -->
                    <svg width="12" height="12" viewBox="0 0 256 256" 
                         [class]="sortState.field === column.key && sortState.direction === 'asc' ? 'text-foreground' : 'text-muted-foreground'">
                      <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" transform="rotate(180 128 128)"/>
                    </svg>
                    <!-- Sort down arrow -->
                    <svg width="12" height="12" viewBox="0 0 256 256"
                         [class]="sortState.field === column.key && sortState.direction === 'desc' ? 'text-foreground' : 'text-muted-foreground'">
                      <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
                    </svg>
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody class="[&_tr:last-child]:border-0">
            <ng-container *ngIf="!loading && paginatedData.length > 0">
              <ng-container *ngFor="let row of paginatedData; let i = index; trackBy: trackByRow">
                <!-- Main row -->
                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <!-- Expand button -->
                  <td *ngIf="expandable" class="p-4 align-middle">
                    <app-button size="sm" variant="ghost" (click)="toggleExpanded(row)">
                      <svg *ngIf="!isExpanded(row)" width="16" height="16" viewBox="0 0 256 256">
                        <path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
                      </svg>
                      <svg *ngIf="isExpanded(row)" width="16" height="16" viewBox="0 0 256 256">
                        <path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"/>
                      </svg>
                    </app-button>
                  </td>
                  
                  <!-- Data cells -->
                  <td *ngFor="let column of columns; trackBy: trackByColumn"
                      [class]="getCellClasses(column)"
                      [style.width]="column.width"
                      [style.min-width]="column.minWidth"
                      [style.max-width]="column.maxWidth">
                    <div [class]="getCellContentClasses(column)"
                         [innerHTML]="getCellContent(row, column, i)">
                    </div>
                  </td>
                </tr>

                <!-- Expanded row -->
                <tr *ngIf="expandable && isExpanded(row)" class="border-b">
                  <td [attr.colspan]="columns.length + (expandable ? 1 : 0)" class="p-4">
                    <div [innerHTML]="getExpandedContent(row, i)"></div>
                  </td>
                </tr>
              </ng-container>
            </ng-container>

            <!-- No data row -->
            <tr *ngIf="!loading && paginatedData.length === 0">
              <td [attr.colspan]="columns.length + (expandable ? 1 : 0)" class="h-24 text-center text-muted-foreground">
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div *ngIf="pagination?.showPagination !== false" class="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
        <div class="flex items-center gap-4">
          <span class="text-sm text-muted-foreground">
            Showing {{ startItem }} to {{ endItem }} of {{ pagination?.total || 0 }} results
          </span>
          <div *ngIf="pagination?.showSizeChanger" class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">Show</span>
            <select [(ngModel)]="currentPageSize" (change)="onPageSizeChange()" 
                    class="w-20 h-8 rounded-md border border-input bg-background px-3 py-1 text-sm">
              <option *ngFor="let size of pagination?.pageSizeOptions || [10, 20, 50]" [value]="size">
                {{ size }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <app-button variant="outline" size="sm" [disabled]="currentPage <= 1" (click)="onPreviousPage()">
            <svg width="16" height="16" viewBox="0 0 256 256">
              <path fill="currentColor" d="m165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/>
            </svg>
          </app-button>
          
          <span class="text-sm text-muted-foreground">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          
          <app-button variant="outline" size="sm" [disabled]="currentPage >= totalPages" (click)="onNextPage()">
            <svg width="16" height="16" viewBox="0 0 256 256">
              <path fill="currentColor" d="m221.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L204.69,128,130.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,221.66,133.66Z"/>
            </svg>
          </app-button>
        </div>
      </div>
    </div>
  `
})
export class AdvancedTableComponent<T = any> implements OnInit, OnChanges {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() loading = false;
  @Input() rowKey: string | ((record: T) => string) = 'id';
  @Input() expandable?: TableProps<T>['expandable'];
  @Input() pagination?: TableProps<T>['pagination'];
  @Input() sticky?: TableProps<T>['sticky'];
  @Input() scroll?: TableProps<T>['scroll'];
  @Input() className = '';

  @Output() pageChange = new EventEmitter<{page: number, pageSize: number}>();
  @Output() sort = new EventEmitter<{field: string, direction: 'asc' | 'desc' | null}>();
  @Output() expand = new EventEmitter<{expanded: boolean, record: T}>();

  sortState: SortState = { field: null, direction: null };
  expandedRows = new Set<string>();
  currentPage = 1;
  currentPageSize = 10;

  ngOnInit(): void {
    if (this.pagination) {
      this.currentPage = this.pagination.current;
      this.currentPageSize = this.pagination.pageSize;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && this.pagination) {
      this.currentPage = this.pagination.current;
      this.currentPageSize = this.pagination.pageSize;
    }
  }

  get paginatedData(): T[] {
    if (!this.pagination?.showPagination) {
      return this.data;
    }
    const start = (this.currentPage - 1) * this.currentPageSize;
    const end = start + this.currentPageSize;
    return this.data.slice(start, end);
  }

  get totalPages(): number {
    if (!this.pagination?.total) return 0;
    return Math.ceil(this.pagination.total / this.currentPageSize);
  }

  get startItem(): number {
    if (!this.pagination?.total || this.pagination.total === 0) return 1;
    return (this.currentPage - 1) * this.currentPageSize + 1;
  }

  get endItem(): number {
    if (!this.pagination?.total) return this.paginatedData.length;
    const calculated = this.currentPage * this.currentPageSize;
    return Math.min(calculated, this.pagination.total);
  }

  trackByColumn(index: number, column: TableColumn<T>): string {
    return column.key;
  }

  trackByRow(index: number, row: T): string {
    return typeof this.rowKey === 'function' ? this.rowKey(row) : (row as any)[this.rowKey];
  }

  getHeaderClasses(column: TableColumn<T>): string {
    const baseClasses = 'h-12 px-4 text-left align-middle font-medium text-muted-foreground';
    const frozenClasses = column.frozen ? 'sticky bg-muted/50 z-10' : '';
    const leftClasses = column.frozen === true || column.frozen === 'left' ? 'left-0' : '';
    const rightClasses = column.frozen === 'right' ? 'right-0' : '';
    
    return `${baseClasses} ${frozenClasses} ${leftClasses} ${rightClasses}`.trim();
  }

  getCellClasses(column: TableColumn<T>): string {
    const baseClasses = 'p-4 align-middle';
    const frozenClasses = column.frozen ? 'sticky bg-background z-10' : '';
    const leftClasses = column.frozen === true || column.frozen === 'left' ? 'left-0' : '';
    const rightClasses = column.frozen === 'right' ? 'right-0' : '';
    
    return `${baseClasses} ${frozenClasses} ${leftClasses} ${rightClasses}`.trim();
  }

  getCellContentClasses(column: TableColumn<T>): string {
    let classes = '';
    if (column.ellipsis) {
      classes += 'truncate ';
    }
    if (!column.multiline) {
      classes += 'whitespace-nowrap ';
    }
    return classes.trim();
  }

  getCellContent(row: T, column: TableColumn<T>, index: number): string {
    const value = (row as any)[column.key];
    if (column.render) {
      return column.render(value, row, index);
    }
    return value?.toString() || '';
  }

  getExpandedContent(row: T, index: number): string {
    if (this.expandable?.expandedRowRender) {
      return this.expandable.expandedRowRender(row, index);
    }
    return '';
  }

  isExpanded(row: T): boolean {
    const key = this.trackByRow(0, row);
    return this.expandedRows.has(key);
  }

  toggleExpanded(row: T): void {
    const key = this.trackByRow(0, row);
    const wasExpanded = this.expandedRows.has(key);
    
    if (wasExpanded) {
      this.expandedRows.delete(key);
    } else {
      this.expandedRows.add(key);
    }
    
    this.expand.emit({ expanded: !wasExpanded, record: row });
  }

  handleSort(field: string): void {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (this.sortState.field === field) {
      if (this.sortState.direction === 'asc') {
        direction = 'desc';
      } else if (this.sortState.direction === 'desc') {
        direction = null;
      }
    }
    
    this.sortState = { field: direction ? field : null, direction };
    this.sort.emit({ field, direction });
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.pageChange.emit({ page: this.currentPage, pageSize: this.currentPageSize });
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit({ page: this.currentPage, pageSize: this.currentPageSize });
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit({ page: this.currentPage, pageSize: this.currentPageSize });
    }
  }
}