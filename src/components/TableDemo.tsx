import React, { useState, useEffect } from 'react';
import { AdvancedTable } from '@/components/AdvancedTable';
import { TableColumn } from '@/lib/table-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface User {
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

const generateSampleData = (): User[] => {
  const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Emma Davis', 'Tom Wilson', 'Lisa Anderson', 'Chris Taylor', 'Anna Miller'];
  const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer', 'Analyst'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];

  // Varying description lengths to showcase min/max width behavior
  const descriptions = [
    // Short descriptions (~100-150 characters)
    "Experienced professional with strong analytical skills and attention to detail in complex projects.",
    "Team player with excellent communication abilities and proven track record of delivering results.",
    "Creative problem solver with expertise in modern technologies and agile methodologies.",
    
    // Medium descriptions (~200-300 characters)
    "Senior professional with over 8 years of experience in cross-functional collaboration, project management, and strategic planning. Known for innovative solutions and mentoring junior team members while maintaining high quality standards.",
    "Dedicated specialist focusing on process optimization, data analysis, and customer satisfaction. Proven ability to work under pressure while delivering exceptional results that exceed expectations and drive business growth.",
    "Results-driven expert with comprehensive knowledge in multiple domains including technical implementation, stakeholder management, and continuous improvement initiatives that enhance organizational effectiveness.",
    
    // Long descriptions (~400-500 characters)
    "Highly accomplished professional with extensive experience spanning multiple industries and functional areas. Demonstrates exceptional leadership capabilities, strategic thinking, and technical expertise while fostering collaborative environments that promote innovation and growth. Recognized for outstanding performance in complex project delivery, cross-functional team coordination, and stakeholder relationship management across diverse organizational structures and challenging business environments.",
    "Dynamic and versatile specialist with a proven track record of success in driving transformational initiatives, implementing cutting-edge solutions, and building high-performing teams. Expertise includes advanced analytical methodologies, strategic planning, risk management, and operational excellence. Consistently delivers measurable business impact through innovative approaches, effective communication, and collaborative leadership that inspires teams to achieve exceptional results.",
    "Accomplished industry leader with deep expertise in organizational development, technology innovation, and business strategy execution. Brings unique combination of technical proficiency, business acumen, and interpersonal skills to complex challenges. Known for ability to translate vision into actionable plans, build consensus among diverse stakeholders, and deliver sustainable value creation through continuous improvement and strategic partnerships."
  ];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: names[i % names.length] + ` ${i + 1}`,
    email: `user${i + 1}@company.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    joinDate: new Date(2020 + (i % 4), (i % 12), (i % 28) + 1).toISOString().split('T')[0],
    lastLogin: new Date(2024, 0, (i % 30) + 1).toISOString().split('T')[0],
    department: departments[i % departments.length],
    salary: 50000 + (i * 1000),
    description: descriptions[i % descriptions.length]
  }));
};

export function TableDemo() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [sortState, setSortState] = useState<{
    field: string | null;
    direction: 'asc' | 'desc' | null;
  }>({
    field: null,
    direction: null
  });

  const allData = generateSampleData();

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      let filteredData = [...allData];
      
      // Apply sorting
      if (sortState.field && sortState.direction) {
        filteredData.sort((a, b) => {
          const aVal = a[sortState.field as keyof User];
          const bVal = b[sortState.field as keyof User];
          
          let comparison = 0;
          if (aVal < bVal) comparison = -1;
          if (aVal > bVal) comparison = 1;
          
          return sortState.direction === 'desc' ? -comparison : comparison;
        });
      }

      // Apply pagination
      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setData(paginatedData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
      setLoading(false);
    }, 500);
  }, [pagination.current, pagination.pageSize, sortState]);

  const columns: TableColumn<User>[] = [
    {
      key: 'id',
      title: 'ID',
      minWidth: 80,
      maxWidth: 120,
      frozen: true,
      sortable: true
    },
    {
      key: 'name',
      title: 'Name',
      minWidth: 150,
      maxWidth: 250,
      sortable: true,
      render: (value, record) => (
        <div className="font-medium text-foreground">{value}</div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      minWidth: 200,
      maxWidth: 300,
      ellipsis: true,
      sortable: true
    },
    {
      key: 'role',
      title: 'Role',
      minWidth: 300, // Fixed width for badges
      sortable: true,
      render: (value) => (
        <Badge variant="secondary">{value}</Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      width: 120, // Fixed width for status badges
      sortable: true,
      render: (value) => (
        <Badge 
          variant={value === 'active' ? 'default' : value === 'pending' ? 'secondary' : 'destructive'}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'department',
      title: 'Department',
      minWidth: 120,
      maxWidth: 180,
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
      // No maxWidth specified - can grow as needed
      ellipsis: true
    },
    {
      key: 'salary',
      title: 'Salary',
      minWidth: 100,
      maxWidth: 150,
      sortable: true,
      render: (value) => `$${value.toLocaleString()}`,
    }
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }));
  };

  const handleSort = (field: string, direction: 'asc' | 'desc' | null) => {
    setSortState({ field, direction });
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
  };

  const expandedRowRender = (record: User) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Contact Information</h4>
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Email:</span> {record.email}</div>
            <div><span className="font-medium">Department:</span> {record.department}</div>
            <div><span className="font-medium">Role:</span> {record.role}</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Employment Details</h4>
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Join Date:</span> {record.joinDate}</div>
            <div><span className="font-medium">Last Login:</span> {record.lastLogin}</div>
            <div><span className="font-medium">Salary:</span> ${record.salary.toLocaleString()}</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Description</h4>
          <p className="text-sm text-muted-foreground">{record.description}</p>
        </Card>
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline">Edit User</Button>
        <Button size="sm" variant="outline">View Profile</Button>
        <Button size="sm" variant="destructive">Delete User</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Advanced Data Table</h1>
          <p className="text-muted-foreground">
            A comprehensive table component with sticky headers, sorting, pagination, expandable rows, frozen columns, and flexible width handling with min/max constraints.
          </p>
        </div>
        <ThemeSwitcher />
      </div>

      <div>
        <AdvancedTable
          data={data}
          columns={columns}
          loading={loading}
          rowKey="id"
          expandable={{
            expandedRowRender,
            expandRowByClick: false,
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50],
            showPagination: true,
          }}
          sticky={{
            offsetHeader: 0,
          }}
          scroll={{
            x: 1200, // Reduced since some columns are now flexible
          }}
          onPageChange={handlePageChange}
          onSort={handleSort}
          onExpand={(expanded, record) => {
            console.log('Row expanded:', expanded, record);
          }}
          className="shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Features Demonstrated</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Sticky header behavior</li>
            <li>• Frozen columns (ID & Name)</li>
            <li>• Sortable columns</li>
            <li>• Expandable rows</li>
          </ul>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Pagination</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Configurable page sizes</li>
            <li>• Page navigation</li>
            <li>• Total count display</li>
            <li>• Persistent state</li>
          </ul>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Column Features</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Fixed, min/max & flexible widths</li>
            <li>• Text ellipsis handling</li>
            <li>• Custom cell rendering</li>
            <li>• Horizontal scrolling</li>
          </ul>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Event Driven</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Sort events</li>
            <li>• Pagination events</li>
            <li>• Expand events</li>
            <li>• Loading states</li>
          </ul>
        </Card>
      </div>

      {/* Add extra content to enable scrolling and test sticky header */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Content for Scroll Testing</h2>
        <p className="text-muted-foreground">
          Scroll down to see the sticky header behavior in action. The table header should remain visible at the top of the viewport.
        </p>
        
        {Array.from({ length: 20 }).map((_, i) => (
          <Card key={i} className="p-6">
            <h3 className="font-semibold mb-2">Section {i + 1}</h3>
            <p className="text-muted-foreground mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-muted-foreground">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
              culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}