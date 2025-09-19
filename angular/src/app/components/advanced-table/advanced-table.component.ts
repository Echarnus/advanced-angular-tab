import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableProps, TableColumn, SortState } from '../../types/table-types';
import { cn } from '../../lib/utils';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-table.component.html',
  styleUrl: './advanced-table.component.css'
})
export class AdvancedTableComponent<T extends Record<string, any>> implements OnInit, OnDestroy {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() loading: boolean = false;
  @Input() rowKey: string | ((record: T) => string) = 'id';
  @Input() expandable?: TableProps<T>['expandable'];
  @Input() pagination?: TableProps<T>['pagination'];
  @Input() sticky?: TableProps<T>['sticky'];
  @Input() scroll?: TableProps<T>['scroll'];
  @Input() className?: string;

  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();
  @Output() sort = new EventEmitter<{ field: string; direction: 'asc' | 'desc' | null }>();
  @Output() expand = new EventEmitter<{ expanded: boolean; record: T }>();

  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('tableHeader', { static: true }) tableHeader!: ElementRef<HTMLTableSectionElement>;

  sortState: SortState = { field: null, direction: null };
  expandedRows = new Set<string>();
  stickyTop = 0;
  cn = cn;
  Math = Math;

  trackByRowKey = (index: number, record: T): string => {
    return this.getRowKey(record, index);
  };

  private scrollListener?: () => void;
  private resizeListener?: () => void;

  ngOnInit() {
    this.setupScrollListeners();
    this.updateStickyPosition();
  }

  ngOnDestroy() {
    this.removeScrollListeners();
  }

  private setupScrollListeners() {
    this.scrollListener = () => this.updateStickyPosition();
    this.resizeListener = () => this.updateStickyPosition();

    document.addEventListener('scroll', this.scrollListener, true);
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.resizeListener);
  }

  private removeScrollListeners() {
    if (this.scrollListener) {
      document.removeEventListener('scroll', this.scrollListener, true);
      window.removeEventListener('scroll', this.scrollListener);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private updateStickyPosition() {
    if (!this.tableContainer) return;

    const rect = this.tableContainer.nativeElement.getBoundingClientRect();
    const newStickyTop = Math.max(0, -rect.top);
    this.stickyTop = newStickyTop;
  }

  getRowKey(record: T, index: number): string {
    if (typeof this.rowKey === 'function') {
      return this.rowKey(record);
    }
    return record[this.rowKey] || index.toString();
  }

  isRowExpanded(record: T, index: number): boolean {
    const key = this.getRowKey(record, index);
    return this.expandedRows.has(key);
  }

  toggleRowExpansion(record: T, index: number) {
    const key = this.getRowKey(record, index);
    const wasExpanded = this.expandedRows.has(key);
    
    if (wasExpanded) {
      this.expandedRows.delete(key);
    } else {
      this.expandedRows.add(key);
    }

    this.expand.emit({ expanded: !wasExpanded, record });
  }

  handleSort(column: TableColumn<T>) {
    if (!column.sortable) return;

    let newDirection: 'asc' | 'desc' | null = 'asc';
    
    if (this.sortState.field === column.key) {
      if (this.sortState.direction === 'asc') {
        newDirection = 'desc';
      } else if (this.sortState.direction === 'desc') {
        newDirection = null;
      }
    }

    this.sortState = { 
      field: newDirection ? column.key : null, 
      direction: newDirection 
    };
    
    this.sort.emit({ field: column.key, direction: newDirection });
  }

  handlePageChange(page: number, pageSize: number) {
    this.pageChange.emit({ page, pageSize });
    this.scrollToTop();
  }

  private scrollToTop() {
    if (this.tableContainer) {
      const tableRect = this.tableContainer.nativeElement.getBoundingClientRect();
      const offsetHeader = this.sticky?.offsetHeader || 0;
      
      if (tableRect.top < offsetHeader) {
        const scrollTop = window.pageYOffset + tableRect.top - offsetHeader;
        
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }
  }

  getColumnStyle(column: TableColumn<T>): any {
    const styles: any = {};
    
    if (column.width) {
      styles.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
    }
    if (column.minWidth) {
      styles.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
    }
    if (column.maxWidth) {
      styles.maxWidth = typeof column.maxWidth === 'number' ? `${column.maxWidth}px` : column.maxWidth;
    }

    return styles;
  }

  getCellValue(record: T, column: TableColumn<T>, index: number): any {
    const value = record[column.key];
    if (column.render) {
      return column.render(value, record, index);
    }
    return value;
  }

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const current = this.pagination.current;
    const total = Math.ceil(this.pagination.total / this.pagination.pageSize);
    const numbers: number[] = [];
    
    // Simple pagination - show first, last, and around current
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }
    
    return numbers;
  }

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newPageSize = parseInt(select.value);
    this.handlePageChange(1, newPageSize);
  }
}
