import { TemplateRef } from '@angular/core';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  sortable?: boolean;
  frozen?: boolean | 'left' | 'right';
  render?: (value: any, record: T, index: number) => any;
  cellTemplate?: TemplateRef<any>;
  ellipsis?: boolean;
  multiline?: boolean;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  expandable?: {
    expandedRowRender?: (record: T, index: number) => any;
    expandedRowTemplate?: TemplateRef<any>;
    expandRowByClick?: boolean;
  };
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    showQuickJumper?: boolean;
    showPagination?: boolean;
  };
  sticky?: {
    offsetHeader?: number;
  };
  scroll?: {
    x?: string | number;
    y?: string | number;
  };
  onPageChange?: (page: number, pageSize: number) => void;
  onSort?: (field: string, direction: 'asc' | 'desc' | null) => void;
  onExpand?: (expanded: boolean, record: T) => void;
  className?: string;
}

export interface SortState {
  field: string | null;
  direction: 'asc' | 'desc' | null;
}