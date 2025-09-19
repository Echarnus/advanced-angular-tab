export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  sortable?: boolean;
  frozen?: boolean | 'left' | 'right';
  render?: (value: any, record: T, index: number) => any;
  ellipsis?: boolean;
  multiline?: boolean;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  expandable?: {
    expandedRowRender: (record: T, index: number) => any;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastLogin: string;
  department: string;
  salary: number;
  description: string;
}