import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  className = input<string>('');

  get cardClasses(): string {
    return `bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm ${this.className()}`;
  }
}