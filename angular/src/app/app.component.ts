import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableDemoComponent } from './components/table-demo/table-demo.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TableDemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';
}
