import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './ui/button.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <app-button 
      variant="outline" 
      size="sm" 
      (click)="toggleTheme()"
      [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
      <!-- Sun icon for light mode -->
      <svg *ngIf="isDark" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
        <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,1,69.66,58.34l16,16a8,8,0,0,1-11.32,11.32Zm0,116.68-16-16a8,8,0,0,1,11.32-11.32l16,16a8,8,0,0,1-11.32,11.32ZM192,72a8,8,0,0,1,5.66-2.34l16-16a8,8,0,0,1,11.32,11.32l-16,16A8,8,0,0,1,192,72Zm5.66,114.34a8,8,0,0,1-11.32,11.32l-16-16a8,8,0,0,1,11.32-11.32ZM48,128a8,8,0,0,1-8-8H16a8,8,0,0,1,0-16H40a8,8,0,0,1,8,8Zm80,80a8,8,0,0,1-8,8v24a8,8,0,0,1-16,0V216a8,8,0,0,1,8-8Zm112-88a8,8,0,0,1-8,8H208a8,8,0,0,1,0-16h24A8,8,0,0,1,240,120Z"/>
      </svg>
      
      <!-- Moon icon for dark mode -->
      <svg *ngIf="!isDark" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
        <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"/>
      </svg>
    </app-button>
  `
})
export class ThemeSwitcherComponent {
  constructor(private themeService: ThemeService) {}

  get isDark(): boolean {
    return this.themeService.isDark;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}