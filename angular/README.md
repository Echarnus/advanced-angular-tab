# Angular Advanced Data Table

This is an Angular 19 implementation of the advanced data table component, providing an exact equivalent to the React version.

## Features

- **Sticky Headers**: Table headers remain visible while scrolling
- **Sorting**: Click column headers to sort data (ascending/descending/none)
- **Pagination**: Navigate through pages with configurable page sizes
- **Expandable Rows**: Click expand buttons to view detailed user information
- **Frozen Columns**: ID and Last Login columns remain fixed during horizontal scroll
- **Custom Cell Rendering**: Role and status badges with appropriate colors
- **Loading States**: Skeleton placeholders during data loading
- **Responsive Design**: Table adapts to different screen sizes

## Technical Stack

- **Angular 19**: Latest Angular framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Standalone Components**: Modern Angular architecture
- **RxJS**: Reactive programming patterns

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── advanced-table/          # Main table component
│   │   ├── table-demo/              # Demo implementation
│   │   └── ui/                      # Reusable UI components
│   │       ├── badge/
│   │       └── button/
│   ├── lib/
│   │   └── utils.ts                 # Utility functions
│   ├── services/
│   │   └── user-data.service.ts     # Data service
│   └── types/
│       ├── table-types.ts           # Table interfaces
│       └── user.interface.ts        # User data model
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

The application will be available at `http://localhost:4200`.

## Component Usage

### Basic Usage

```typescript
import { AdvancedTableComponent } from './components/advanced-table/advanced-table.component';

// In your component
export class MyComponent {
  data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' }
  ];
  
  columns = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true }
  ];
}
```

```html
<app-advanced-table
  [data]="data"
  [columns]="columns"
  [pagination]="paginationConfig"
  (pageChange)="onPageChange($event)"
  (sort)="onSort($event)">
</app-advanced-table>
```

### Advanced Features

```typescript
// Column configuration with custom rendering
columns = [
  {
    key: 'status',
    title: 'Status',
    cellTemplate: statusTemplate,  // Custom template
    sortable: true
  },
  {
    key: 'id',
    title: 'ID',
    frozen: true,  // Frozen column
    sortable: true
  }
];

// Expandable rows
expandable = {
  expandedRowTemplate: expandedRowTemplate
};
```

## API Reference

### AdvancedTableComponent

#### Inputs
- `data: T[]` - Array of data objects
- `columns: TableColumn<T>[]` - Column definitions
- `loading?: boolean` - Loading state
- `pagination?: TablePagination` - Pagination configuration
- `expandable?: TableExpandable` - Expandable row configuration
- `sticky?: TableSticky` - Sticky header configuration

#### Outputs
- `pageChange: EventEmitter<{page: number, pageSize: number}>` - Page change events
- `sort: EventEmitter<{field: string, direction: 'asc'|'desc'|null}>` - Sort events
- `expand: EventEmitter<{expanded: boolean, record: T}>` - Row expand events

### TableColumn Interface

```typescript
interface TableColumn<T> {
  key: string;                    // Data property key
  title: string;                  // Column header text
  width?: string | number;        // Column width
  sortable?: boolean;             // Enable sorting
  frozen?: boolean | 'left' | 'right';  // Freeze column
  cellTemplate?: TemplateRef<any>; // Custom cell template
  render?: (value: any, record: T, index: number) => any;  // Custom renderer
}
```

## Comparison with React Version

This Angular implementation provides 100% feature parity with the React version:

| Feature | React ✅ | Angular ✅ |
|---------|----------|------------|
| Sticky Headers | ✅ | ✅ |
| Column Sorting | ✅ | ✅ |
| Pagination | ✅ | ✅ |
| Expandable Rows | ✅ | ✅ |
| Frozen Columns | ✅ | ✅ |
| Custom Cell Rendering | ✅ | ✅ |
| Loading States | ✅ | ✅ |
| Responsive Design | ✅ | ✅ |
| TypeScript Support | ✅ | ✅ |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the advanced-angular-tab repository and follows the same licensing terms.
