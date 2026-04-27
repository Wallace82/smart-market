import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SeasonalTheme {
  id: string;
  name: string;
  event: string;
  primaryColor: string;
  secondaryColor: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'draft' | 'archived';
  supermarketCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminThemesService {
  
  getThemes(): Observable<SeasonalTheme[]> {
    return of<SeasonalTheme[]>([
      {
        id: 'T001',
        name: 'Dia das Mães 2026',
        event: 'Dia das Mães',
        primaryColor: '#ec4899',
        secondaryColor: '#fdf2f8',
        startDate: '2026-05-01T00:00:00',
        endDate: '2026-05-12T00:00:00',
        status: 'active',
        supermarketCount: 450
      },
      {
        id: 'T002',
        name: 'Festa Junina 2026',
        event: 'Festa Junina',
        primaryColor: '#f97316',
        secondaryColor: '#fff7ed',
        startDate: '2026-06-01T00:00:00',
        endDate: '2026-06-30T00:00:00',
        status: 'scheduled',
        supermarketCount: 120
      },
      {
        id: 'T003',
        name: 'Black Friday 2026',
        event: 'Black Friday',
        primaryColor: '#1f2937',
        secondaryColor: '#f3f4f6',
        startDate: '2026-11-20T00:00:00',
        endDate: '2026-11-30T00:00:00',
        status: 'draft',
        supermarketCount: 0
      },
      {
        id: 'T004',
        name: 'Páscoa Smart 2026',
        event: 'Páscoa',
        primaryColor: '#8b5cf6',
        secondaryColor: '#f5f3ff',
        startDate: '2026-03-20T00:00:00',
        endDate: '2026-04-05T00:00:00',
        status: 'archived',
        supermarketCount: 890
      }
    ]);
  }
}
