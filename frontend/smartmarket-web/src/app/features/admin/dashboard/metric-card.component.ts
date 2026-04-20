import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './metric-card.component.html'
})
export class MetricCardComponent {
  @Input({ required: true }) metric!: {
    color: string;
    icon: string;
    title: string;
    value: string | number;
  };
}