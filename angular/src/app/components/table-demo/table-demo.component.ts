import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedTableComponent } from '../advanced-table/advanced-table.component';
import { BadgeComponent } from '../ui/badge/badge.component';
import { ButtonComponent } from '../ui/button/button.component';
import { TableColumn } from '../../types/table-types';
import { User } from '../../types/user.interface';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [CommonModule, AdvancedTableComponent, BadgeComponent, ButtonComponent],
  templateUrl: './table-demo.component.html',
  styleUrl: './table-demo.component.css'
})
export class TableDemoComponent implements OnInit {
  @ViewChild('nameTemplate', { static: true }) nameTemplate!: TemplateRef<any>;
  @ViewChild('roleTemplate', { static: true }) roleTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('salaryTemplate', { static: true }) salaryTemplate!: TemplateRef<any>;
  @ViewChild('expandedRowTemplate', { static: true }) expandedRowTemplate!: TemplateRef<any>;

  data: User[] = [];
  loading = true;
  allData: User[] = [];
  
  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
    showQuickJumper: true,
    showPagination: true
  };

  sortState: {
    field: string | null;
    direction: 'asc' | 'desc' | null;
  } = {
    field: null,
    direction: null
  };

  columns: TableColumn<User>[] = [];

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.allData = this.userDataService.generateSampleData();
    this.setupColumns();
    this.loadData();
  }

  private setupColumns() {
    this.columns = [
      {
        key: 'id',
        title: 'ID',
        frozen: true,
        sortable: true,
        width: 80
      },
      {
        key: 'name',
        title: 'Name',
        width: 200,
        sortable: true,
        cellTemplate: this.nameTemplate
      },
      {
        key: 'email',
        title: 'Email',
        width: 250,
        sortable: true
      },
      {
        key: 'role',
        title: 'Role',
        width: 120,
        sortable: true,
        cellTemplate: this.roleTemplate
      },
      {
        key: 'status',
        title: 'Status',
        width: 100,
        sortable: true,
        cellTemplate: this.statusTemplate
      },
      {
        key: 'department',
        title: 'Department',
        width: 150,
        sortable: true
      },
      {
        key: 'joinDate',
        title: 'Join Date',
        width: 120,
        sortable: true
      },
      {
        key: 'salary',
        title: 'Salary',
        width: 120,
        sortable: true,
        cellTemplate: this.salaryTemplate
      },
      {
        key: 'description',
        title: 'Description',
        multiline: false
      },
      {
        key: 'lastLogin',
        title: 'Last Login',
        width: 120,
        sortable: true,
        frozen: 'right'
      }
    ];
  }

  private loadData() {
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

      // Apply pagination
      const startIndex = (this.pagination.current - 1) * this.pagination.pageSize;
      const endIndex = startIndex + this.pagination.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      this.data = paginatedData;
      this.pagination.total = filteredData.length;
      this.loading = false;
    }, 500);
  }

  onPageChange(event: { page: number; pageSize: number }) {
    this.pagination.current = event.page;
    this.pagination.pageSize = event.pageSize;
    this.loadData();
  }

  onSort(event: { field: string; direction: 'asc' | 'desc' | null }) {
    this.sortState.field = event.field;
    this.sortState.direction = event.direction;
    this.pagination.current = 1; // Reset to first page
    this.loadData();
  }

  onExpand(event: { expanded: boolean; record: User }) {
    console.log('Row expanded:', event.expanded, event.record);
  }

  editUser(user: User) {
    console.log('Edit user:', user);
  }

  viewProfile(user: User) {
    console.log('View profile:', user);
  }

  deleteUser(user: User) {
    console.log('Delete user:', user);
  }

  getStatusVariant(status: string): 'success' | 'destructive' | 'warning' {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'destructive';
      case 'pending': return 'warning';
      default: return 'warning';
    }
  }

  getRoleVariant(role: string): 'default' | 'secondary' | 'outline' {
    switch (role) {
      case 'Admin': return 'default';
      case 'Manager': return 'secondary';
      default: return 'outline';
    }
  }
}
