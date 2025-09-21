import { Component, input, output, OnInit, OnChanges, OnDestroy, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './ui/button.component';
import { TableColumn, TableProps, SortState } from '../types/table.types';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './advanced-table.component.html',
  styleUrl: './advanced-table.component.css'
})
export class AdvancedTableComponent<T = any> implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  data = input<T[]>([]);
  columns = input<TableColumn<T>[]>([]);
  loading = input<boolean>(false);
  rowKey = input<string | ((record: T) => string)>('id');
  expandable = input<TableProps<T>['expandable']>();
  pagination = input<TableProps<T>['pagination']>();
  sticky = input<TableProps<T>['sticky']>();
  scroll = input<TableProps<T>['scroll']>();
  className = input<string>('');

  pageChange = output<{page: number, pageSize: number}>();
  sort = output<{field: string | null, direction: 'asc' | 'desc' | null}>();
  expand = output<{expanded: boolean, record: T}>();

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
    const pagination = this.pagination();
    if (pagination) {
      this.currentPage = pagination.current;
      this.currentPageSize = pagination.pageSize;
    }
  }

  ngAfterViewInit(): void {
    this.setupStickyPositioning();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const pagination = this.pagination();
    if (changes['pagination'] && pagination) {
      this.currentPage = pagination.current;
      this.currentPageSize = pagination.pageSize;
    }
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  get leftFrozenColumns(): TableColumn<T>[] {
    return this.columns().filter(col => col.frozen === true || col.frozen === 'left');
  }

  get rightFrozenColumns(): TableColumn<T>[] {
    return this.columns().filter(col => col.frozen === 'right');
  }

  get scrollableColumns(): TableColumn<T>[] {
    return this.columns().filter(col => !col.frozen);
  }

  get totalPages(): number {
    const pagination = this.pagination();
    if (!pagination?.total) return 0;
    return Math.ceil(pagination.total / this.currentPageSize);
  }

  get startItem(): number {
    const pagination = this.pagination();
    if (!pagination?.total || pagination.total === 0) return 1;
    return (this.currentPage - 1) * this.currentPageSize + 1;
  }

  get endItem(): number {
    const pagination = this.pagination();
    const calculated = this.currentPage * this.currentPageSize;
    if (!pagination?.total) return this.paginatedData.length;
    
    return Math.min(calculated, pagination.total);
  }

  get flexibleColumns(): number {
    return this.columns().filter(col => !col.width).length;
  }

  get paginatedData(): T[] {
    const data = this.data();
    if (!data || data.length === 0) return [];
    
    const start = (this.currentPage - 1) * this.currentPageSize;
    const end = start + this.currentPageSize;
    
    return data.slice(start, end);
  }

  trackByColumn(index: number, column: TableColumn<T>): string {
    return column.key;
  }

  trackByRow(index: number, row: T): string {
    const rowKey = this.rowKey();
    return typeof rowKey === 'function' ? rowKey(row) : (row as any)[rowKey];
  }

  getTableClasses(): string {
    const baseClasses = 'w-full border-collapse table-fixed';
    const loadingClasses = this.loading() ? 'opacity-50 cursor-not-allowed' : '';
    return `${baseClasses} ${loadingClasses}`.trim();
  }

  getHeaderClasses(column: TableColumn<T>): string {
    const baseClasses = 'px-4 py-3 text-left border-b border-border';
    const frozenClasses = column.frozen ? 'sticky z-40 border-r-2 shadow-lg shadow-black/5 relative' : '';
    const stickyClasses = this.sticky() ? 'table-header-blur' : '';
    const sortableClasses = column.sortable ? 'cursor-pointer hover:bg-muted/50' : '';
    
    let positionClasses = '';
    if (column.frozen === true || column.frozen === 'left') {
      positionClasses = 'left-0';
    } else if (column.frozen === 'right') {
      positionClasses = 'right-0';
    }

    return `${baseClasses} ${frozenClasses} ${stickyClasses} ${sortableClasses} ${positionClasses}`.trim();
  }

  getCellClasses(column: TableColumn<T>): string {
    const baseClasses = 'px-4 py-3 border-b border-border transition-colors';
    const frozenClasses = column.frozen ? 'sticky z-30 border-r-2 shadow-lg shadow-black/5 relative' : '';
    const stickyClasses = this.sticky() ? 'table-cell-blur' : '';
    
    let positionClasses = '';
    if (column.frozen === true || column.frozen === 'left') {
      positionClasses = 'left-0';
    } else if (column.frozen === 'right') {
      positionClasses = 'right-0';
    }

    return `${baseClasses} ${frozenClasses} ${stickyClasses} ${positionClasses}`.trim();
  }

  getCellContentClasses(column: TableColumn<T>): string {
    return column.ellipsis ? 'truncate' : '';
  }

  getColumnStyle(column: TableColumn<T>): Record<string, string> {
    const style: Record<string, string> = {};
    
    if (column.width) {
      style['width'] = `${column.width}px`;
    }
    if (column.minWidth) {
      style['min-width'] = `${column.minWidth}px`;
    }
    if (column.maxWidth) {
      style['max-width'] = `${column.maxWidth}px`;
    }
    
    const sticky = this.sticky();
    if (sticky) {
      style['top'] = `${this.stickyTop}px`;
    }

    return style;
  }

  getCellStyle(column: TableColumn<T>): Record<string, string> {
    const style: Record<string, string> = {};
    
    if (column.width) {
      style['width'] = `${column.width}px`;
    }
    if (column.minWidth) {
      style['min-width'] = `${column.minWidth}px`;
    }
    if (column.maxWidth) {
      style['max-width'] = `${column.maxWidth}px`;
    }

    return style;
  }

  getLayoutColumnStyle(column: TableColumn<T>): Record<string, string> {
    return this.getColumnStyle(column);
  }

  handleSort(field: string): void {
    if (this.loading()) return;

    if (this.sortState.field === field) {
      // Cycle through: asc -> desc -> null
      if (this.sortState.direction === 'asc') {
        this.sortState.direction = 'desc';
      } else if (this.sortState.direction === 'desc') {
        this.sortState.field = null;
        this.sortState.direction = null;
      }
    } else {
      this.sortState.field = field;
      this.sortState.direction = 'asc';
    }

    this.sort.emit({
      field: this.sortState.field,
      direction: this.sortState.direction
    });
  }

  isExpanded(row: T): boolean {
    const rowKey = this.rowKey();
    const key = typeof rowKey === 'function' ? rowKey(row) : (row as any)[rowKey];
    return this.expandedRows.has(String(key));
  }

  toggleExpanded(row: T): void {
    const rowKey = this.rowKey();
    const key = typeof rowKey === 'function' ? rowKey(row) : (row as any)[rowKey];
    const keyStr = String(key);
    
    const wasExpanded = this.expandedRows.has(keyStr);
    
    if (wasExpanded) {
      this.expandedRows.delete(keyStr);
    } else {
      this.expandedRows.add(keyStr);
    }

    this.expand.emit({
      expanded: !wasExpanded,
      record: row
    });
  }

  getCellContent(row: T, column: TableColumn<T>, index: number): string {
    const value = (row as any)[column.key];
    
    if (column.render) {
      return column.render(value, row, index);
    }
    
    return value != null ? String(value) : '';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.pageChange.emit({
      page: this.currentPage,
      pageSize: this.currentPageSize
    });
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.pageChange.emit({
      page: this.currentPage,
      pageSize: this.currentPageSize
    });
  }

  onPrevPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  private setupStickyPositioning(): void {
    const updateStickyTop = () => {
      const sticky = this.sticky();
      if (sticky) {
        this.stickyTop = sticky.offsetHeader || 0;
      }
    };

    updateStickyTop();

    this.scrollListener = () => updateStickyTop();
    this.resizeListener = () => updateStickyTop();

    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.resizeListener);
  }
}