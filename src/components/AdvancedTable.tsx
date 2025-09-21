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
  const [stickyTop, setStickyTop] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);

  // Calculate sticky position based on scroll
  useEffect(() => {
    const updateStickyPosition = () => {
      if (!tableRef.current) return;
      
      const rect = tableRef.current.getBoundingClientRect();
      const newStickyTop = Math.max(0, -rect.top);
      setStickyTop(newStickyTop);
    };

    const handleScroll = () => {
      updateStickyPosition();
    };

    // Listen to both window scroll and any parent scroll containers
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateStickyPosition);

    // Initial calculation
    updateStickyPosition();

    return () => {
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateStickyPosition);
    };
  }, []);

  // Recalculate sticky position when data changes (e.g., pagination)
  useEffect(() => {
    const updateStickyPosition = () => {
      if (!tableRef.current) return;
      
      const rect = tableRef.current.getBoundingClientRect();
      const newStickyTop = Math.max(0, -rect.top);
      setStickyTop(newStickyTop);
    };

    // Use setTimeout to ensure DOM has updated after data change
    const timer = setTimeout(updateStickyPosition, 0);
    
    return () => clearTimeout(timer);
  }, [data, pagination?.current]);

  const leftFrozenColumns = columns.filter(col => col.frozen === true || col.frozen === 'left');
  const rightFrozenColumns = columns.filter(col => col.frozen === 'right');
  const scrollableColumns = columns.filter(col => !col.frozen);

  // Calculate total fixed width and flexible columns
  const calculateColumnWidths = () => {
    let totalFixedWidth = 0;
    let flexibleColumns = 0;
    
    // Add expand button width if present
    if (expandable) totalFixedWidth += 48;
    
    columns.forEach(col => {
      if (col.width) {
        // Only count columns with explicit width as fixed
        totalFixedWidth += typeof col.width === 'number' ? col.width : parseInt(String(col.width));
      } else {
        // Columns with minWidth/maxWidth or no width constraints are flexible
        flexibleColumns++;
      }
    });
    
    return { totalFixedWidth, flexibleColumns };
  };

  const { totalFixedWidth, flexibleColumns } = calculateColumnWidths();

  const getRowKey = (record: T, index: number): string => {
    return typeof rowKey === 'function' ? rowKey(record) : String(record[rowKey] || index);
  };

  const scrollToTop = () => {
    if (tableRef.current) {
      const tableRect = tableRef.current.getBoundingClientRect();
      const offsetHeader = sticky?.offsetHeader || 0;
      
      // Only scroll if the table top is not visible or if we're scrolled past it
      // Check if table top is above the viewport (considering any offset header)
      if (tableRect.top < offsetHeader) {
        const scrollTop = window.pageYOffset + tableRect.top - offsetHeader;
        
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
      // If table is already visible at the top, don't scroll
    }
  };

  const handlePageChangeWithScroll = (page: number, pageSize: number) => {
    onPageChange?.(page, pageSize);
    scrollToTop();
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

  const renderColumnHeader = (column: TableColumn<T>) => {
    const isLeftFrozen = column.frozen === true || column.frozen === 'left';
    const isRightFrozen = column.frozen === 'right';
    const isLastLeftFrozen = isLeftFrozen && leftFrozenColumns[leftFrozenColumns.length - 1]?.key === column.key;
    const isFirstRightFrozen = isRightFrozen && rightFrozenColumns[0]?.key === column.key;
    
    // Calculate left offset for left frozen columns
    let leftOffset = 0;
    if (isLeftFrozen) {
      if (expandable) leftOffset += 48; // Expand button width
      
      // Add widths of previous left frozen columns
      for (const leftCol of leftFrozenColumns) {
        if (leftCol.key === column.key) break;
        const width = leftCol.width;
        // For columns with explicit width, use that
        // For columns with only minWidth/maxWidth, use minWidth or fallback
        if (width) {
          leftOffset += typeof width === 'number' ? width : parseInt(String(width));
        } else if (leftCol.minWidth) {
          leftOffset += typeof leftCol.minWidth === 'number' ? leftCol.minWidth : parseInt(String(leftCol.minWidth));
        } else {
          leftOffset += 120; // Reasonable default for flexible frozen columns
        }
      }
    }

    // Determine column width - handle min/max constraints properly
    let columnWidth: string | number | undefined;
    if (column.width) {
      // Fixed width takes precedence
      columnWidth = column.width;
    } else if (column.minWidth || column.maxWidth) {
      // For columns with min/max constraints, don't set width to allow CSS min/max to work
      columnWidth = undefined;
    } else if (flexibleColumns > 0) {
      // Only use 'auto' for truly flexible columns without constraints
      columnWidth = 'auto';
    } else {
      columnWidth = undefined;
    }
    
    return (
      <th
        key={column.key}
        className={cn(
          "px-4 py-3 text-left text-sm font-medium text-foreground table-header-blur border-b border-border relative",
          isLeftFrozen && "sticky z-50",
          isRightFrozen && "sticky right-0 z-40",
          column.sortable && !loading && "cursor-pointer hover:bg-muted/50 transition-colors",
          loading && "opacity-50 cursor-not-allowed",
          // Add visual distinction for frozen columns
          isLastLeftFrozen && "border-r-2 border-border shadow-lg shadow-black/5",
          isFirstRightFrozen && "border-l-2 border-border shadow-lg shadow-black/5"
        )}
        style={{
          width: columnWidth,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
          ...(isLeftFrozen && { left: leftOffset }),
          ...(isLeftFrozen && { top: `${stickyTop}px` }),
          ...(isRightFrozen && { top: `${stickyTop}px` }),
        }}
        onClick={() => !loading && handleSort(column)}
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
  };

  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = record[column.key];
    const content = column.render ? column.render(value, record, index) : value;
    const isLeftFrozen = column.frozen === true || column.frozen === 'left';
    const isRightFrozen = column.frozen === 'right';
    const isLastLeftFrozen = isLeftFrozen && leftFrozenColumns[leftFrozenColumns.length - 1]?.key === column.key;
    const isFirstRightFrozen = isRightFrozen && rightFrozenColumns[0]?.key === column.key;
    
    // Calculate left offset for left frozen columns
    let leftOffset = 0;
    if (isLeftFrozen) {
      if (expandable) leftOffset += 48; // Expand button width
      
      // Add widths of previous left frozen columns
      for (const leftCol of leftFrozenColumns) {
        if (leftCol.key === column.key) break;
        const width = leftCol.width;
        // For columns with explicit width, use that
        // For columns with only minWidth/maxWidth, use minWidth or fallback
        if (width) {
          leftOffset += typeof width === 'number' ? width : parseInt(String(width));
        } else if (leftCol.minWidth) {
          leftOffset += typeof leftCol.minWidth === 'number' ? leftCol.minWidth : parseInt(String(leftCol.minWidth));
        } else {
          leftOffset += 120; // Reasonable default for flexible frozen columns
        }
      }
    }

    // Determine column width - handle min/max constraints properly
    let columnWidth: string | number | undefined;
    if (column.width) {
      // Fixed width takes precedence
      columnWidth = column.width;
    } else if (column.minWidth || column.maxWidth) {
      // For columns with min/max constraints, don't set width to allow CSS min/max to work
      columnWidth = undefined;
    } else if (flexibleColumns > 0) {
      // Only use 'auto' for truly flexible columns without constraints
      columnWidth = 'auto';
    } else {
      columnWidth = undefined;
    }
    
    return (
      <td
        key={column.key}
        className={cn(
          "px-4 py-3 text-sm relative transition-colors",
          isLeftFrozen && "sticky z-30 table-cell-blur frozen-cell",
          isRightFrozen && "sticky right-0 z-20 table-cell-blur frozen-cell",
          column.ellipsis && "max-w-0",
          column.multiline ? "whitespace-normal" : "whitespace-nowrap",
          // Add visual distinction for frozen columns
          isLastLeftFrozen && "border-r-2 border-border shadow-lg shadow-black/5",
          isFirstRightFrozen && "border-l-2 border-border shadow-lg shadow-black/5"
        )}
        style={{
          width: columnWidth,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
          ...(isLeftFrozen && { left: leftOffset }),
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
      <td className="px-4 py-3 sticky left-0 z-30 table-cell-blur w-12 border-r-2 shadow-lg shadow-black/5 relative frozen-cell transition-colors">
        {expandable?.expandRowByClick ? (
          // Just show an indicator when row click expands
          <div className="flex items-center justify-center h-6 w-6">
            {isExpanded ? <Minus size={14} className="text-muted-foreground" /> : <Plus size={14} className="text-muted-foreground" />}
          </div>
        ) : (
          // Show clickable button when manual expand
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExpand(record)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
          </Button>
        )}
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
                onValueChange={(value) => handlePageChangeWithScroll(1, parseInt(value))}
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
            onClick={() => handlePageChangeWithScroll(current - 1, pageSize)}
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
            onClick={() => handlePageChangeWithScroll(current + 1, pageSize)}
            disabled={current >= totalPages}
          >
            <CaretRight size={16} />
          </Button>
        </div>
      </div>
    );
  };



  return (
    <div className={cn("flex flex-col", className)}>
      <Card className="flex flex-col relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-[100] loading-overlay flex items-center justify-center">
            <div className="bg-card/90 backdrop-blur-md rounded-lg px-6 py-4 shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Loading data...</span>
              </div>
            </div>
          </div>
        )}
        <div
          ref={tableRef}
          className="overflow-x-auto flex-1"
        >
          <table className={cn(
            "w-full border-collapse",
            flexibleColumns > 0 ? "table-auto" : "table-fixed"
          )} style={{ minWidth: scroll?.x }}>
            {/* First thead for layout spacing - invisible */}
            <thead className="invisible">
              <tr>
                {expandable && (
                  <th className="w-12 px-4 py-3" />
                )}
                {leftFrozenColumns.map(column => {
                  const columnWidth = column.width || (column.minWidth || column.maxWidth ? undefined : (flexibleColumns > 0 ? 'auto' : undefined));
                  return (
                    <th
                      key={`layout-${column.key}`}
                      style={{
                        width: columnWidth,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth
                      }}
                      className="px-4 py-3"
                    >
                      {column.title}
                    </th>
                  );
                })}
                {scrollableColumns.map(column => {
                  const columnWidth = column.width || (column.minWidth || column.maxWidth ? undefined : (flexibleColumns > 0 ? 'auto' : undefined));
                  return (
                    <th
                      key={`layout-${column.key}`}
                      style={{
                        width: columnWidth,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth
                      }}
                      className="px-4 py-3"
                    >
                      {column.title}
                    </th>
                  );
                })}
                {rightFrozenColumns.map(column => {
                  const columnWidth = column.width || (column.minWidth || column.maxWidth ? undefined : (flexibleColumns > 0 ? 'auto' : undefined));
                  return (
                    <th
                      key={`layout-${column.key}`}
                      style={{
                        width: columnWidth,
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth
                      }}
                      className="px-4 py-3"
                    >
                      {column.title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            
            {/* Second thead for visible sticky header */}
            <thead 
              ref={headerRef}
              className="sticky z-40 table-header-blur border-b border-border"
              style={{ top: `${stickyTop}px` }}
            >
              <tr>
                {expandable && (
                  <th 
                    className="w-12 px-4 py-3 sticky left-0 z-50 table-header-blur border-b border-border border-r-2 shadow-lg shadow-black/5 relative"
                    style={{ top: `${stickyTop}px` }}
                  >
                    <span className="sr-only">Expand</span>
                  </th>
                )}
                {leftFrozenColumns.map(renderColumnHeader)}
                {scrollableColumns.map(renderColumnHeader)}
                {rightFrozenColumns.map(renderColumnHeader)}
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
                          "table-row hover:bg-muted/50 transition-colors",
                          expandable?.expandRowByClick && "cursor-pointer"
                        )}
                        onClick={() => expandable?.expandRowByClick && handleExpand(record)}
                      >
                        {expandable && renderExpandButton(record, index)}
                        {leftFrozenColumns.map(column => renderCell(column, record, index))}
                        {scrollableColumns.map(column => renderCell(column, record, index))}
                        {rightFrozenColumns.map(column => renderCell(column, record, index))}
                      </tr>
                      {expandable && isExpanded && (
                        <tr className="bg-muted/20">
                          <td colSpan={columns.length + 1} className="p-0">
                            <div className="sticky left-0 right-0 z-10 p-4 bg-muted/20 border-b border-border">
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
    </div>
  );
}