import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marketing-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Marketing & QR Code</h1>
      <p class="text-gray-600">Página em construção. Aqui você poderá gerenciar as campanhas de proximidade e o Totem de QR Code.</p>
    </div>
  `
})
export class MarketingDashboardComponent {
}