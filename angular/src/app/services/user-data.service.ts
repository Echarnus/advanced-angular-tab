import { Injectable } from '@angular/core';
import { User } from '../types/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  generateSampleData(): User[] {
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Emma Davis', 'Tom Wilson', 'Lisa Anderson', 'Chris Taylor', 'Anna Miller'];
    const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer', 'Analyst'];
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];

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
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. User ${i + 1} details.`
    }));
  }
}