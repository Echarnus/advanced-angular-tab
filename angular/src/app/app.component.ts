import { Component, OnInit } from '@angular/core';
import { TableDemoComponent } from './components/table-demo.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [TableDemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize theme on app start
  }
}
