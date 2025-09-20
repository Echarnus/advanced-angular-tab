import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './ui/button.component';
import { TableColumn, TableProps, SortState } from '../types/table.types';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div [class]="'flex flex-col ' + (className || '')">
      <div class="flex flex-col relative border rounded-lg bg-card">
        <!-- Loading overlay -->
        <div *ngIf="loading" class="absolute inset-0 z-[100] flex items-center justify-center bg-card/90 backdrop-blur-md">
          <div class="bg-card/90 backdrop-blur-md rounded-lg px-6 py-4 shadow-lg border border-border">
            <div class="flex items-center gap-3">
              <div class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              <span class="text-sm font-medium text-foreground">Loading data...</span>
            </div>
          </div>
        </div>

        <!-- Table container -->
        <div #tableContainer class="overflow-x-auto flex-1 scrollbar-visible" [style.max-height]="scroll?.y">
          <table [class]="getTableClasses()" [style.min-width]="scroll?.x">
            
            <!-- First thead for layout spacing - invisible -->
            <thead class="invisible">
              <tr>
                <th *ngIf="expandable" class="w-12 px-4 py-3"></th>
                <th *ngFor="let column of leftFrozenColumns; trackBy: trackByColumn"
                    class="px-4 py-3"
                    [style]="getLayoutColumnStyle(column)">
                  {{ column.title }}
                </th>
                <th *ngFor="let column of scrollableColumns; trackBy: trackByColumn"
                    class="px-4 py-3"
                    [style]="getLayoutColumnStyle(column)">
                  {{ column.title }}
                </th>
                <th *ngFor="let column of rightFrozenColumns; trackBy: trackByColumn"
                    class="px-4 py-3"
                    [style]="getLayoutColumnStyle(column)">
                  {{ column.title }}
                </th>
              </tr>
            </thead>

            <!-- Second thead for visible sticky header -->
            <thead #headerElement 
                   class="sticky z-40 border-b border-border"
                   [class.table-header-blur]="sticky"
                   [style.top.px]="sticky ? stickyTop : 0">
              <tr>
                <!-- Expand column header -->
                <th *ngIf="expandable" 
                    class="w-12 px-4 py-3 sticky left-0 z-50 border-b border-border border-r-2 shadow-lg shadow-black/5 relative"
                    [class.table-header-blur]="sticky"
                    [style.top.px]="sticky ? stickyTop : 0">
                  <span class="sr-only">Expand</span>
                </th>
                
                <!-- Left frozen columns -->
                <th *ngFor="let column of leftFrozenColumns; trackBy: trackByColumn"
                    [class]="getHeaderClasses(column)"
                    [style]="getColumnStyle(column)"
                    (click)="!loading && column.sortable ? handleSort(column.key) : null">
                  <div class="flex items-center gap-2">
                    <span [class]="column.ellipsis ? 'truncate' : ''">{{ column.title }}</span>
                    <div *ngIf="column.sortable" class="flex flex-col">
                      <svg *ngIf="sortState.field === column.key && sortState.direction === 'asc'" 
                           width="14" height="14" viewBox="0 0 256 256" class="text-primary">
                        <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" transform="rotate(180 128 128)"/>
                      </svg>
                      <svg *ngIf="sortState.field === column.key && sortState.direction === 'desc'" 
                           width="14" height="14" viewBox="0 0 256 256" class="text-primary">
                        <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
                      </svg>
                      <div *ngIf="!sortState.field || sortState.field !== column.key" class="flex flex-col">
                        <svg width="12" height="12" viewBox="0 0 256 256" class="text-muted-foreground">
                          <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" transform="rotate(180 128 128)"/>
                        </svg>
                        <svg width="12" height="12" viewBox="0 0 256 256" class="text-muted-foreground -mt-1">
                          <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </th>
                
                <!-- Scrollable columns -->
                <th *ngFor="let column of scrollableColumns; trackBy: trackByColumn"
                    [class]="getHeaderClasses(column)"
                    [style]="getColumnStyle(column)"
                    (click)="!loading && column.sortable ? handleSort(column.key) : null">
                  <div class="flex items-center gap-2">
                    <span [class]="column.ellipsis ? 'truncate' : ''">{{ column.title }}</span>
                    <div *ngIf="column.sortable" class="flex flex-col">
                      <svg *ngIf="sortState.field === column.key && sortState.direction === 'asc'" 
                           width="14" height="14" viewBox="0 0 256 256" class="text-primary">
                        <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" transform="rotate(180 128 128)"/>
                      </svg>
                      <svg *ngIf="sortState.field === column.key && sortState.direction === 'desc'" 
                           width="14" height="14" viewBox="0 0 256 256" class="text-primary">
                        <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
                      </svg>
                      <div *ngIf="!sortState.field || sortState.field !== column.key" class="flex flex-col">
                        <svg width="12" height="12" viewBox="0 0 256 256" class="text-muted-foreground">
                          <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" transform="rotate(180 128 128)"/>
                        </svg>
                        <svg width="12" height="12" viewBox="0 0 256 256" class="text-muted-foreground -mt-1">
                          <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </th>
                
                <!-- Right frozen columns -->
                <th *ngFor="let column of rightFrozenColumns; trackBy: trackByColumn"
                    [class]="getHeaderClasses(column)"
                    [style]="getColumnStyle(column)"
                    (click)="!loading && column.sortable ? handleSort(column.key) : null">
                  <div class="flex items-center gap-2">
                    <span [class]="column.ellipsis ? 'truncate' : ''">{{ column.title }}</span>
                    <div *ngIf="column.sortable" class="flex flex-col">
                      <svg *ngIf="sortState.field === column.key && sortState.direction === 'asc'" 
                           width="14" height="14" viewBox="0 0 256 256" class="text-primary">
                        <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" transform="rotate(180 128 128)"/>
                      </svg>
                      <svg *ngIf="sortState.field === column.key && sortState.direction === 'desc'" 
                           width="14" height="14" viewBox="0 0 256 256" class="text-primary">
                        <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
                      </svg>
                      <div *ngIf="!sortState.field || sortState.field !== column.key" class="flex flex-col">
                        <svg width="12" height="12" viewBox="0 0 256 256" class="text-muted-foreground">
                          <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" transform="rotate(180 128 128)"/>
                        </svg>
                        <svg width="12" height="12" viewBox="0 0 256 256" class="text-muted-foreground -mt-1">
                          <path fill="currentColor" d="m213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            <!-- Table body -->
            <tbody>
              <!-- No data row -->
              <tr *ngIf="paginatedData.length === 0">
                <td [attr.colspan]="columns.length + (expandable ? 1 : 0)" 
                    class="px-4 py-8 text-center text-muted-foreground">
                  No data available
                </td>
              </tr>
              
              <!-- Data rows -->
              <ng-container *ngFor="let row of paginatedData; let i = index; trackBy: trackByRow">
                <!-- Main row -->
                <tr class="table-row hover:bg-muted/50 transition-colors"
                    [class.cursor-pointer]="expandable?.expandRowByClick"
                    (click)="expandable?.expandRowByClick ? toggleExpanded(row) : null">
                  
                  <!-- Expand button -->
                  <td *ngIf="expandable" 
                      class="px-4 py-3 sticky left-0 z-30 w-12 border-r-2 shadow-lg shadow-black/5 relative transition-colors"
                      [class.table-cell-blur]="sticky">
                    <app-button *ngIf="!expandable?.expandRowByClick"
                                variant="ghost" 
                                size="sm" 
                                class="h-6 w-6 p-0"
                                (click)="toggleExpanded(row)">
                      <svg *ngIf="!isExpanded(row)" width="14" height="14" viewBox="0 0 256 256">
                        <path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
                      </svg>
                      <svg *ngIf="isExpanded(row)" width="14" height="14" viewBox="0 0 256 256">
                        <path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"/>
                      </svg>
                    </app-button>
                    <div *ngIf="expandable?.expandRowByClick" class="flex items-center justify-center h-6 w-6">
                      <svg *ngIf="!isExpanded(row)" width="14" height="14" viewBox="0 0 256 256" class="text-muted-foreground">
                        <path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
                      </svg>
                      <svg *ngIf="isExpanded(row)" width="14" height="14" viewBox="0 0 256 256" class="text-muted-foreground">
                        <path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"/>
                      </svg>
                    </div>
                  </td>
                  
                  <!-- Left frozen columns -->
                  <td *ngFor="let column of leftFrozenColumns; trackBy: trackByColumn"
                      [class]="getCellClasses(column)"
                      [style]="getCellStyle(column)">
                    <div [class]="getCellContentClasses(column)"
                         [title]="column.ellipsis ? getCellContent(row, column, i) : null"
                         [innerHTML]="getCellContent(row, column, i)">
                    </div>
                  </td>
                  
                  <!-- Scrollable columns -->
                  <td *ngFor="let column of scrollableColumns; trackBy: trackByColumn"
                      [class]="getCellClasses(column)"
                      [style]="getCellStyle(column)">
                    <div [class]="getCellContentClasses(column)"
                         [title]="column.ellipsis ? getCellContent(row, column, i) : null"
                         [innerHTML]="getCellContent(row, column, i)">
                    </div>
                  </td>
                  
                  <!-- Right frozen columns -->
                  <td *ngFor="let column of rightFrozenColumns; trackBy: trackByColumn"
                      [class]="getCellClasses(column)"
                      [style]="getCellStyle(column)">
                    <div [class]="getCellContentClasses(column)"
                         [title]="column.ellipsis ? getCellContent(row, column, i) : null"
                         [innerHTML]="getCellContent(row, column, i)">
                    </div>
                  </td>
                </tr>

                <!-- Expanded row -->
                <tr *ngIf="expandable && isExpanded(row)" class="bg-muted/20">
                  <td [attr.colspan]="columns.length + 1" class="p-0">
                    <div class="sticky left-0 right-0 z-10 p-4 bg-muted/20 border-b border-border">
                      <div [innerHTML]="getExpandedContent(row, i)"></div>
                    </div>
                  </td>
                </tr>
              </ng-container>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div *ngIf="pagination?.showPagination !== false" 
             class="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
          <div class="flex items-center gap-4">
            <span class="text-sm text-muted-foreground">
              Showing {{ startItem }} to {{ endItem }} of {{ pagination?.total || 0 }} results
            </span>
            <div *ngIf="pagination?.showSizeChanger" class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground">Show</span>
              <select [(ngModel)]="currentPageSize" 
                      (change)="onPageSizeChange()" 
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
    </div>
  `
})
export class AdvancedTableComponent<T = any> implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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

  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('headerElement', { static: false }) headerElement!: ElementRef<HTMLTableSectionElement>;

  sortState: SortState = { field: null, direction: null };
  expandedRows = new Set<string>();
  currentPage = 1;
  currentPageSize = 10;
  stickyTop = 0;

  private scrollListener?: () => void;
  private resizeListener?: () => void;

  ngOnInit(): void {
    if (this.pagination) {
      this.currentPage = this.pagination.current;
      this.currentPageSize = this.pagination.pageSize;
    }
  }

  ngAfterViewInit(): void {
    this.setupStickyPositioning();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && this.pagination) {
      this.currentPage = this.pagination.current;
      this.currentPageSize = this.pagination.pageSize;
    }
    
    // Recalculate sticky position when data changes
    if (changes['data'] || changes['pagination']) {
      setTimeout(() => this.updateStickyPosition(), 0);
    }
  }

  ngOnDestroy(): void {
    this.removeStickyPositioning();
  }

  private setupStickyPositioning(): void {
    if (!this.sticky) return;

    this.scrollListener = () => this.updateStickyPosition();
    this.resizeListener = () => this.updateStickyPosition();

    // Listen to both window scroll and document scroll with capture
    document.addEventListener('scroll', this.scrollListener, true);
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.resizeListener);

    // Initial calculation
    this.updateStickyPosition();
  }

  private removeStickyPositioning(): void {
    if (this.scrollListener) {
      document.removeEventListener('scroll', this.scrollListener, true);
      window.removeEventListener('scroll', this.scrollListener);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private updateStickyPosition(): void {
    if (!this.tableContainer?.nativeElement || !this.sticky) return;

    const rect = this.tableContainer.nativeElement.getBoundingClientRect();
    const offsetHeader = this.sticky.offsetHeader || 0;
    const newStickyTop = Math.max(0, -rect.top + offsetHeader);
    this.stickyTop = newStickyTop;
  }

  get paginatedData(): T[] {
    if (!this.pagination?.showPagination) {
      return this.data;
    }
    const start = (this.currentPage - 1) * this.currentPageSize;
    const end = start + this.currentPageSize;
    return this.data.slice(start, end);
  }

  get leftFrozenColumns(): TableColumn<T>[] {
    return this.columns.filter(col => col.frozen === true || col.frozen === 'left');
  }

  get rightFrozenColumns(): TableColumn<T>[] {
    return this.columns.filter(col => col.frozen === 'right');
  }

  get scrollableColumns(): TableColumn<T>[] {
    return this.columns.filter(col => !col.frozen);
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

  get flexibleColumns(): number {
    return this.columns.filter(col => !col.width).length;
  }

  get hasFlexibleColumns(): boolean {
    return this.flexibleColumns > 0;
  }

  getTableClasses(): string {
    const baseClasses = 'w-full border-collapse';
    const layoutClasses = this.hasFlexibleColumns ? 'table-auto' : 'table-fixed';
    return `${baseClasses} ${layoutClasses}`;
  }

  getLayoutColumnStyle(column: TableColumn<T>): any {
    // Determine column width - handle minWidth properly for flexible columns
    let columnWidth: string | number | undefined;
    if (column.width) {
      columnWidth = column.width;
    } else if (column.minWidth && !column.maxWidth) {
      // For columns with only minWidth, use minWidth as base but allow growth
      columnWidth = column.minWidth;
    } else if (this.flexibleColumns > 0) {
      columnWidth = 'auto';
    } else {
      columnWidth = undefined;
    }

    return {
      width: columnWidth,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth
    };
  }

  trackByColumn(index: number, column: TableColumn<T>): string {
    return column.key;
  }

  trackByRow(index: number, row: T): string {
    return typeof this.rowKey === 'function' ? this.rowKey(row) : (row as any)[this.rowKey];
  }

  getHeaderClasses(column: TableColumn<T>): string {
    const baseClasses = 'h-12 px-4 text-left align-middle font-medium text-muted-foreground relative transition-colors table-header-blur';
    const frozenClasses = this.getFrozenHeaderClasses(column);
    const sortableClasses = column.sortable && !this.loading ? 'cursor-pointer hover:bg-muted/50' : '';
    const loadingClasses = this.loading ? 'opacity-50 cursor-not-allowed' : '';
    
    return `${baseClasses} ${frozenClasses} ${sortableClasses} ${loadingClasses}`.trim();
  }

  private getFrozenHeaderClasses(column: TableColumn<T>): string {
    const isLeftFrozen = column.frozen === true || column.frozen === 'left';
    const isRightFrozen = column.frozen === 'right';
    
    if (!isLeftFrozen && !isRightFrozen) return '';
    
    const isLastLeftFrozen = isLeftFrozen && this.leftFrozenColumns[this.leftFrozenColumns.length - 1]?.key === column.key;
    const isFirstRightFrozen = isRightFrozen && this.rightFrozenColumns[0]?.key === column.key;
    
    let classes = 'sticky z-50 table-header-blur frozen-cell ';
    
    if (isLeftFrozen) {
      classes += 'left-0 ';
    }
    if (isRightFrozen) {
      classes += 'right-0 ';
    }
    
    if (isLastLeftFrozen) {
      classes += 'border-r-2 border-border shadow-lg shadow-black/5 ';
    }
    if (isFirstRightFrozen) {
      classes += 'border-l-2 border-border shadow-lg shadow-black/5 ';
    }
    
    return classes.trim();
  }

  getCellClasses(column: TableColumn<T>): string {
    const baseClasses = 'p-4 align-middle relative transition-colors';
    const frozenClasses = this.getFrozenClasses(column);
    
    return `${baseClasses} ${frozenClasses}`.trim();
  }

  private getFrozenClasses(column: TableColumn<T>): string {
    const isLeftFrozen = column.frozen === true || column.frozen === 'left';
    const isRightFrozen = column.frozen === 'right';
    
    if (!isLeftFrozen && !isRightFrozen) return '';
    
    const isLastLeftFrozen = isLeftFrozen && this.leftFrozenColumns[this.leftFrozenColumns.length - 1]?.key === column.key;
    const isFirstRightFrozen = isRightFrozen && this.rightFrozenColumns[0]?.key === column.key;
    
    let classes = 'sticky z-30 table-cell-blur frozen-cell ';
    
    if (isLeftFrozen) {
      classes += 'left-0 ';
    }
    if (isRightFrozen) {
      classes += 'right-0 ';
    }
    
    if (isLastLeftFrozen) {
      classes += 'border-r-2 border-border shadow-lg shadow-black/5 ';
    }
    if (isFirstRightFrozen) {
      classes += 'border-l-2 border-border shadow-lg shadow-black/5 ';
    }
    
    return classes.trim();
  }

  getColumnStyle(column: TableColumn<T>): any {
    // Determine column width - handle minWidth properly for flexible columns
    let columnWidth: string | number | undefined;
    if (column.width) {
      columnWidth = column.width;
    } else if (column.minWidth && !column.maxWidth) {
      // For columns with only minWidth, use minWidth as base but allow growth
      columnWidth = column.minWidth;
    } else if (this.flexibleColumns > 0) {
      columnWidth = 'auto';
    } else {
      columnWidth = undefined;
    }

    const style: any = {
      width: columnWidth,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth
    };
    
    const isLeftFrozen = column.frozen === true || column.frozen === 'left';
    if (isLeftFrozen) {
      style.left = this.calculateLeftOffset(column) + 'px';
      style.top = this.stickyTop + 'px';
    }
    
    const isRightFrozen = column.frozen === 'right';
    if (isRightFrozen) {
      style.top = this.stickyTop + 'px';
    }
    
    return style;
  }

  private calculateLeftOffset(column: TableColumn<T>): number {
    let offset = 0;
    
    // Add expand button width if present
    if (this.expandable) {
      offset += 48;
    }
    
    // Add widths of previous left frozen columns
    for (const leftCol of this.leftFrozenColumns) {
      if (leftCol.key === column.key) break;
      
      const width = leftCol.width;
      if (width) {
        offset += typeof width === 'number' ? width : parseInt(String(width));
      } else if (leftCol.minWidth) {
        offset += typeof leftCol.minWidth === 'number' ? leftCol.minWidth : parseInt(String(leftCol.minWidth));
      } else {
        offset += 120; // Default width for flexible frozen columns
      }
    }
    
    return offset;
  }

  getCellStyle(column: TableColumn<T>): any {
    // Determine column width - handle minWidth properly for flexible columns
    let columnWidth: string | number | undefined;
    if (column.width) {
      columnWidth = column.width;
    } else if (column.minWidth && !column.maxWidth) {
      // For columns with only minWidth, use minWidth as base but allow growth
      columnWidth = column.minWidth;
    } else if (this.flexibleColumns > 0) {
      columnWidth = 'auto';
    } else {
      columnWidth = undefined;
    }

    const style: any = {
      width: columnWidth,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth
    };
    
    const isLeftFrozen = column.frozen === true || column.frozen === 'left';
    if (isLeftFrozen) {
      style.left = this.calculateLeftOffset(column) + 'px';
    }
    
    return style;
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

  private scrollToTop(): void {
    if (!this.tableContainer?.nativeElement) return;
    
    const tableRect = this.tableContainer.nativeElement.getBoundingClientRect();
    const offsetHeader = this.sticky?.offsetHeader || 0;
    
    // Only scroll if the table top is not visible or if we're scrolled past it
    if (tableRect.top < offsetHeader) {
      const scrollTop = window.pageYOffset + tableRect.top - offsetHeader;
      
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.pageChange.emit({ page: this.currentPage, pageSize: this.currentPageSize });
    this.scrollToTop();
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit({ page: this.currentPage, pageSize: this.currentPageSize });
      this.scrollToTop();
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit({ page: this.currentPage, pageSize: this.currentPageSize });
      this.scrollToTop();
    }
  }
}