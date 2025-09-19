import { Injectable } from '@angular/core';
import { User } from '../types/table.types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  generateSampleData(): User[] {
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Emma Davis', 'Tom Wilson', 'Lisa Anderson', 'Chris Taylor', 'Anna Miller'];
    const roles = ['Admin', 'User', 'Manager', 'Developer', 'Designer', 'Analyst'];
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];
    
    const descriptions = [
      "Experienced professional with strong analytical skills and attention to detail in complex projects.",
      "Team player with excellent communication abilities and proven track record of delivering results.",
      "Creative problem solver with expertise in modern technologies and agile methodologies.",
      "Senior professional with over 8 years of experience in cross-functional collaboration, project management, and strategic planning. Known for innovative solutions and mentoring junior team members while maintaining high quality standards.",
      "Dedicated specialist focusing on process optimization, data analysis, and customer satisfaction. Proven ability to work under pressure while delivering exceptional results that exceed expectations and drive business growth.",
      "Results-driven expert with comprehensive knowledge in multiple domains including technical implementation, stakeholder management, and continuous improvement initiatives that enhance organizational effectiveness.",
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
  }
}