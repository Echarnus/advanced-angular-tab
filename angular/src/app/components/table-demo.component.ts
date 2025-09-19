import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdvancedTableComponent } from './advanced-table.component';
import { BadgeComponent } from './ui/badge.component';
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
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    ThemeSwitcherComponent
  ],
  template: `
    <div class="min-h-screen bg-background p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-4xl font-bold tracking-tight mb-2">Advanced Data Table</h1>
          <p class="text-muted-foreground max-w-3xl">
            A comprehensive table component with sticky headers, sorting, pagination, expandable rows, frozen columns, and flexible width handling with min/max constraints.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <app-button
            variant="outline"
            size="sm"
            (click)="showConfig = !showConfig">
            <svg width="16" height="16" viewBox="0 0 256 256">
              <path fill="currentColor" d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3.12-3.12L186-218.16a8,8,0,0,0-3.93-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.21,107.21,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.48-3.12,3.12L40.68,70.02a8,8,0,0,0-6,3.93,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.48,1.56,3.12,3.12L70,215.32a8,8,0,0,0,3.93,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3.12-3.12L215.32,186a8,8,0,0,0,6-3.93,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,184A56,56,0,1,1,184,128,56.06,56.06,0,0,1,128,184Z"/>
            </svg>
            {{ showConfig ? 'Hide Config' : 'Show Config' }}
          </app-button>
          <app-theme-switcher></app-theme-switcher>
        </div>
      </div>

      <!-- Configuration Panel -->
      <app-card *ngIf="showConfig" className="p-6 mb-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">Column Configuration</h3>
              <p class="text-sm text-muted-foreground">
                Edit the JSON configuration to test different column scenarios. Render functions will be automatically applied.
              </p>
            </div>
            <div class="flex gap-2">
              <app-button size="sm" variant="outline" (click)="resetConfig()">
                <svg width="16" height="16" viewBox="0 0 256 256">
                  <path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
                </svg>
                Reset
              </app-button>
              <app-button size="sm" (click)="applyConfig()">
                Apply Changes
              </app-button>
            </div>
          </div>
          <textarea
            [(ngModel)]="configText"
            class="w-full h-64 p-3 border rounded-md bg-background text-sm font-mono"
            placeholder="Column configuration JSON..."></textarea>
        </div>
      </app-card>

      <!-- Table -->
      <div class="space-y-6">
        <app-advanced-table
          [data]="allData"
          [columns]="columns"
          [loading]="loading"
          [expandable]="{
            expandedRowRender: getExpandedRowRender.bind(this),
            expandRowByClick: false
          }"
          [pagination]="{
            current: 1,
            pageSize: 10,
            total: allData.length,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
            showPagination: true
          }"
          [sticky]="{ offsetHeader: 0 }"
          [scroll]="{ x: '100%' }"
          (pageChange)="onPageChange($event)"
          (sort)="onSort($event)"
          (expand)="onExpand($event)"
          className="shadow-sm">
        </app-advanced-table>
      </div>

      <!-- Feature Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <app-card className="p-4">
          <h3 class="font-semibold mb-2">Features Demonstrated</h3>
          <ul class="text-sm space-y-1 text-muted-foreground">
            <li>• Sticky header behavior</li>
            <li>• Frozen columns (ID & Name)</li>
            <li>• Sortable columns</li>
            <li>• Expandable rows</li>
          </ul>
        </app-card>
        
        <app-card className="p-4">
          <h3 class="font-semibold mb-2">Pagination</h3>
          <ul class="text-sm space-y-1 text-muted-foreground">
            <li>• Configurable page sizes</li>
            <li>• Page navigation</li>
            <li>• Total count display</li>
            <li>• Persistent state</li>
          </ul>
        </app-card>
        
        <app-card className="p-4">
          <h3 class="font-semibold mb-2">Column Features</h3>
          <ul class="text-sm space-y-1 text-muted-foreground">
            <li>• Fixed, min/max & flexible widths</li>
            <li>• Text ellipsis handling</li>
            <li>• Custom cell rendering</li>
            <li>• Horizontal scrolling</li>
          </ul>
        </app-card>
        
        <app-card className="p-4">
          <h3 class="font-semibold mb-2">Event Driven</h3>
          <ul class="text-sm space-y-1 text-muted-foreground">
            <li>• Sort events</li>
            <li>• Pagination events</li>
            <li>• Expand events</li>
            <li>• Loading states</li>
          </ul>
        </app-card>
      </div>

      <!-- Additional Content for Scroll Testing -->
      <div class="space-y-8 mt-16">
        <h2 class="text-xl font-semibold">Additional Content for Scroll Testing</h2>
        <p class="text-muted-foreground">
          Scroll down to see the sticky header behavior in action. The table header should remain visible at the top of the viewport.
        </p>
        
        <div *ngFor="let section of sections; let i = index" class="space-y-4">
          <app-card className="p-6">
            <h3 class="font-semibold mb-2">Section {{ i + 1 }}</h3>
            <p class="text-muted-foreground mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p class="text-muted-foreground">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
              culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class TableDemoComponent implements OnInit {
  showConfig = false;
  loading = true;
  allData: User[] = [];
  columns: TableColumn<User>[] = [];
  configText = '';
  sections = Array.from({ length: 20 }, (_, i) => i);

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
    
    // Simulate loading
    setTimeout(() => {
      this.loading = false;
    }, 2000);
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

  onSort(event: {field: string, direction: 'asc' | 'desc' | null}): void {
    console.log('Sort changed:', event);
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
}