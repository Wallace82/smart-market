import { Directive, Input, ElementRef, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { SupermarketResponse } from '@core/models/supermarket.model';

@Directive({
  selector: '[appWhitelabelTheme]',
  standalone: true
})
export class WhitelabelThemeDirective implements OnChanges {
  @Input('appWhitelabelTheme') supermarket: SupermarketResponse | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supermarket'] && this.supermarket) {
      this.applyTheme();
    }
  }

  private applyTheme(): void {
    if (!this.supermarket) return;

    const primaryColor = this.supermarket.corPrimariaHex || '#16a34a';
    const secondaryColor = this.supermarket.corSecundariaHex || '#0284c7';

    // Aplica as cores como variáveis CSS customizadas
    this.renderer.setStyle(this.el.nativeElement, '--color-primary', primaryColor);
    this.renderer.setStyle(this.el.nativeElement, '--color-secondary', secondaryColor);
    
    // Gera variações (opcional, pode ser expandido com lógica de darken/lighten)
    this.renderer.setStyle(this.el.nativeElement, '--color-primary-rgb', this.hexToRgb(primaryColor));
    this.renderer.setStyle(this.el.nativeElement, '--color-secondary-rgb', this.hexToRgb(secondaryColor));
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  }
}
