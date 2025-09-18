import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TableProps, TableColumn, SortState } from '@/lib/table-types';
import { CaretDown, CaretUp, CaretLeft, CaretRight, Plus, Minus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function AdvancedTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  rowKey = 'id',
  expandable,
  pagination,
  sticky,
  scroll,
  onPageChange,
  onSort,
  onExpand,
  className
}: TableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ field: null, direction: null });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);

  const frozenColumns = columns.filter(col => col.frozen);
  const scrollableColumns = columns.filter(col => !col.frozen);

  const getRowKey = (record: T, index: number): string => {
    return typeof rowKey === 'function' ? rowKey(record) : String(record[rowKey] || index);
  };

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    let newDirection: 'asc' | 'desc' | null = 'asc';
    
    if (sortState.field === column.key) {
      if (sortState.direction === 'asc') {
        newDirection = 'desc';
      } else if (sortState.direction === 'desc') {
        newDirection = null;
      }
    }

    setSortState({ field: newDirection ? column.key : null, direction: newDirection });
    onSort?.(column.key, newDirection);
  };

  const handleExpand = (record: T) => {
    const key = getRowKey(record, 0);
    const newExpandedRows = new Set(expandedRows);
    
    if (newExpandedRows.has(key)) {
      newExpandedRows.delete(key);
      onExpand?.(false, record);
    } else {
      newExpandedRows.add(key);
      onExpand?.(true, record);
    }
    
    setExpandedRows(newExpandedRows);
  };

  const renderColumnHeader = (column: TableColumn<T>) => (
    <th
      key={column.key}
      className={cn(
        "px-4 py-3 text-left text-sm font-medium text-foreground bg-card/95 backdrop-blur-sm border-b border-border",
        column.sortable && "cursor-pointer hover:bg-muted/50 transition-colors",
        column.frozen && "sticky left-0 z-30 bg-card/95 backdrop-blur-sm"
      )}
      style={{
        width: column.width,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
      }}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        <span className={cn(column.ellipsis && "truncate")}>{column.title}</span>
        {column.sortable && (
          <div className="flex flex-col">
            {sortState.field === column.key ? (
              sortState.direction === 'asc' ? (
                <CaretUp size={14} className="text-primary" />
              ) : sortState.direction === 'desc' ? (
                <CaretDown size={14} className="text-primary" />
              ) : (
                <div className="flex flex-col">
                  <CaretUp size={12} className="text-muted-foreground" />
                  <CaretDown size={12} className="text-muted-foreground -mt-1" />
                </div>
              )
            ) : (
              <div className="flex flex-col">
                <CaretUp size={12} className="text-muted-foreground" />
                <CaretDown size={12} className="text-muted-foreground -mt-1" />
              </div>
            )}
          </div>
        )}
      </div>
    </th>
  );

  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = record[column.key];
    const content = column.render ? column.render(value, record, index) : value;
    
    return (
      <td
        key={column.key}
        className={cn(
          "px-4 py-3 text-sm border-b border-border",
          column.frozen && "sticky left-0 z-10 bg-card",
          column.ellipsis && "max-w-0",
          column.multiline ? "whitespace-normal" : "whitespace-nowrap"
        )}
        style={{
          width: column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
        }}
      >
        {column.ellipsis ? (
          <div className="truncate" title={String(value)}>
            {content}
          </div>
        ) : (
          content
        )}
      </td>
    );
  };

  const renderExpandButton = (record: T, index: number) => {
    const key = getRowKey(record, index);
    const isExpanded = expandedRows.has(key);

    return (
      <td className="px-4 py-3 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExpand(record)}
          className="h-6 w-6 p-0"
        >
          {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
        </Button>
      </td>
    );
  };

  const renderPagination = () => {
    if (!pagination || !pagination.showPagination) return null;

    const { current, pageSize, total, showSizeChanger, pageSizeOptions = [10, 20, 50, 100] } = pagination;
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (current - 1) * pageSize + 1;
    const endItem = Math.min(current * pageSize, total);

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {total} results
          </span>
          {showSizeChanger && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageChange?.(1, parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map(size => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(current - 1, pageSize)}
            disabled={current <= 1}
          >
            <CaretLeft size={16} />
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {current} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(current + 1, pageSize)}
            disabled={current >= totalPages}
          >
            <CaretRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="p-4">
          <Skeleton className="h-8 w-full mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full mb-2" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div
        ref={tableRef}
        className="overflow-auto"
        style={{ 
          maxHeight: scroll?.y || undefined
        }}
      >
        <table className="w-full table-fixed" style={{ minWidth: scroll?.x }}>
          <thead ref={headerRef} className="bg-card/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
            <tr>
              {expandable && (
                <th className="w-12 px-4 py-3 bg-card/95 backdrop-blur-sm border-b border-border sticky left-0 z-30" />
              )}
              {frozenColumns.map(renderColumnHeader)}
              {scrollableColumns.map(renderColumnHeader)}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (expandable ? 1 : 0)}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((record, index) => {
                const key = getRowKey(record, index);
                const isExpanded = expandedRows.has(key);
                
                return (
                  <React.Fragment key={key}>
                    <tr
                      className={cn(
                        "hover:bg-muted/50 transition-colors",
                        expandable?.expandRowByClick && "cursor-pointer"
                      )}
                      onClick={() => expandable?.expandRowByClick && handleExpand(record)}
                    >
                      {expandable && !expandable.expandRowByClick && renderExpandButton(record, index)}
                      {frozenColumns.map(column => renderCell(column, record, index))}
                      {scrollableColumns.map(column => renderCell(column, record, index))}
                    </tr>
                    {expandable && isExpanded && (
                      <tr>
                        <td colSpan={columns.length + 1} className="p-0 border-b border-border">
                          <div className="p-4 bg-muted/20">
                            {expandable.expandedRowRender(record, index)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </Card>
  );
}