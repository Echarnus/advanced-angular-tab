import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdvancedTableComponent } from './advanced-table.component';
import { ButtonComponent } from './ui/button.component';
import { CardComponent } from './ui/card.component';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { DataService } from '../services/data.service';
import { TableColumn, User } from '../types/table.types';

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdvancedTableComponent,
    ButtonComponent,
    CardComponent,
    ThemeSwitcherComponent
  ],
  templateUrl: './table-demo.component.html',
  styleUrl: './table-demo.component.css'
})
export class TableDemoComponent implements OnInit {
  showConfig = false;
  loading = true;
  allData: User[] = [];
  displayData: User[] = [];
  columns: TableColumn<User>[] = [];
  configText = '';
  sections = Array.from({ length: 20 }, (_, i) => i);
  
  // Sort state
  sortState: { field: string | null; direction: 'asc' | 'desc' | null } = {
    field: null,
    direction: null
  };

  private defaultColumns: TableColumn<User>[] = [
    {
      key: 'id',
      title: 'ID',
      width: 100,
      frozen: true,
      sortable: true,
    },
    {
      key: 'name',
      title: 'Name',
      minWidth: 150,
      maxWidth: 200,
      frozen: true,
      sortable: true,
      render: (value: string) => `<div class="font-medium">${value}</div>`,
    },
    {
      key: 'email',
      title: 'Email',
      minWidth: 200,
      maxWidth: 250,
      sortable: true,
    },
    {
      key: 'role',
      title: 'Role',
      minWidth: 120,
      maxWidth: 150,
      sortable: true,
      render: (value: string) => `<span class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-transparent bg-secondary text-secondary-foreground">${value}</span>`,
    },
    {
      key: 'status',
      title: 'Status',
      minWidth: 100,
      maxWidth: 120,
      sortable: true,
      render: (value: string) => {
        const colors = {
          active: 'border-transparent bg-primary text-primary-foreground',
          inactive: 'border-transparent bg-destructive text-white',
          pending: 'border-transparent bg-secondary text-secondary-foreground'
        };
        const colorClass = colors[value as keyof typeof colors] || colors.pending;
        return `<span class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${colorClass}">${value}</span>`;
      },
    },
    {
      key: 'department',
      title: 'Department',
      minWidth: 120,
      maxWidth: 150,
      sortable: true,
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      minWidth: 100,
      maxWidth: 140,
      sortable: true,
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      minWidth: 100,
      maxWidth: 140,
      sortable: true
    },
    {
      key: 'description',
      title: 'Description',
      minWidth: 200,
      maxWidth: 450,
      ellipsis: true
    },
    {
      key: 'salary',
      title: 'Salary',
      minWidth: 100,
      maxWidth: 150,
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`,
    }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.columns = [...this.defaultColumns];
    this.configText = JSON.stringify(this.defaultColumns, null, 2);
    this.allData = this.dataService.generateSampleData();
    
    // Initialize data loading
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    
    // Simulate loading delay
    setTimeout(() => {
      let filteredData = [...this.allData];
      
      // Apply sorting
      if (this.sortState.field && this.sortState.direction) {
        filteredData.sort((a, b) => {
          const aVal = a[this.sortState.field as keyof User];
          const bVal = b[this.sortState.field as keyof User];
          
          let comparison = 0;
          if (aVal < bVal) comparison = -1;
          if (aVal > bVal) comparison = 1;
          
          return this.sortState.direction === 'desc' ? -comparison : comparison;
        });
      }
      
      this.displayData = filteredData;
      this.loading = false;
    }, 300);
  }

  getExpandedRowRender(record: User, index: number): string {
    return `
      <div class="p-4 bg-muted/20 rounded-lg">
        <h4 class="font-semibold mb-2">Additional Details for ${record.name}</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Full Description:</strong>
            <p class="mt-1 text-muted-foreground">${record.description}</p>
          </div>
          <div>
            <strong>Employment Info:</strong>
            <p class="mt-1 text-muted-foreground">
              Joined on ${record.joinDate}<br>
              Department: ${record.department}<br>
              Current Salary: $${record.salary.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  onPageChange(event: {page: number, pageSize: number}): void {
    console.log('Page changed:', event);
  }

  onSort(event: {field: string | null, direction: 'asc' | 'desc' | null}): void {
    console.log('Sort changed:', event);
    this.sortState = {
      field: event.direction ? event.field : null,
      direction: event.direction
    };
    this.loadData();
  }

  onExpand(event: {expanded: boolean, record: User}): void {
    console.log('Row expanded:', event.expanded, event.record);
  }

  resetConfig(): void {
    this.configText = JSON.stringify(this.defaultColumns, null, 2);
  }

  applyConfig(): void {
    try {
      const newColumns = JSON.parse(this.configText);
      // Apply render functions for known columns
      newColumns.forEach((col: TableColumn<User>) => {
        const defaultCol = this.defaultColumns.find(dc => dc.key === col.key);
        if (defaultCol && defaultCol.render) {
          col.render = defaultCol.render;
        }
      });
      this.columns = newColumns;
    } catch (error) {
      console.error('Invalid JSON configuration:', error);
      alert('Invalid JSON configuration. Please check your syntax.');
    }
  }

  applyPreset(presetType: string): void {
    let scenario: TableColumn<User>[] = [];
    
    switch (presetType) {
      case 'multiFrozen':
        scenario = [...this.defaultColumns];
        scenario[0].frozen = true;
        scenario[1].frozen = true; // Make name frozen too
        break;
        
      case 'fixedPlusOne':
        scenario = this.defaultColumns.map(col => ({
          ...col,
          width: col.key === 'description' ? undefined : 150, // Only description flexible
          minWidth: undefined,
          maxWidth: undefined
        }));
        break;
        
      case 'allMinMax':
        scenario = this.defaultColumns.map(col => ({
          ...col,
          width: undefined,
          minWidth: 100,
          maxWidth: col.key === 'description' ? 200 : 150, // Constrained description
          ellipsis: true
        }));
        break;
        
      case 'noConstraints':
        scenario = this.defaultColumns.map(col => ({
          ...col,
          width: undefined,
          minWidth: undefined,
          maxWidth: undefined, // No constraints - grow freely
          ellipsis: false
        }));
        break;
        
      case 'tripleFrozen':
        scenario = [...this.defaultColumns];
        scenario[0].frozen = true;
        scenario[1].frozen = true;
        scenario[2].frozen = true; // First 3 columns frozen
        break;
        
      case 'wideDescription':
        scenario = this.defaultColumns.map(col => ({
          ...col,
          width: col.key === 'description' ? undefined : undefined,
          minWidth: col.key === 'description' ? 400 : 80,
          maxWidth: col.key === 'description' ? 600 : 120,
          ellipsis: col.key === 'description'
        }));
        break;
        
      default:
        scenario = [...this.defaultColumns];
    }
    
    this.configText = JSON.stringify(scenario, null, 2);
    // Apply render functions for known columns
    scenario.forEach((col: TableColumn<User>) => {
      const defaultCol = this.defaultColumns.find(dc => dc.key === col.key);
      if (defaultCol && defaultCol.render) {
        col.render = defaultCol.render;
      }
    });
    this.columns = scenario;
  }
}