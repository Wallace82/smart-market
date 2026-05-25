import { ElementRef, Renderer2, SimpleChange } from '@angular/core';
import { WhitelabelThemeDirective } from './whitelabel-theme.directive';
import { SupermarketResponse } from '@core/models/supermarket.model';

describe('WhitelabelThemeDirective', () => {
  let directive: WhitelabelThemeDirective;
  let mockElementRef: ElementRef;
  let mockRenderer2: jasmine.SpyObj<Renderer2>;

  beforeEach(() => {
    mockElementRef = new ElementRef(document.createElement('div'));
    mockRenderer2 = jasmine.createSpyObj('Renderer2', ['setStyle']);
    directive = new WhitelabelThemeDirective(mockElementRef, mockRenderer2);
  });

  it('deve ser instanciado com sucesso', () => {
    expect(directive).toBeTruthy();
  });

  it('deve aplicar as cores primária e secundária passadas pelo supermarket', () => {
    const mockSupermarket: SupermarketResponse = {
      id: 'super-1',
      nomeFantasia: 'Mercado Teste',
      cnpj: '12345678000199',
      telefone: '11999999999',
      email: 'contato@mercado.com',
      status: 'ATIVO',
      corPrimariaHex: '#ff5733',
      corSecundariaHex: '#33ff57',
      urlLogomarca: 'http://logo.url',
      endereco: 'Rua Principal, 123',
      latitude: -15.78,
      longitude: -47.92,
      raioAtuacao: 10,
      gestorId: 'gestor-1'
    };

    directive.supermarket = mockSupermarket;

    // Simular a chamada de ciclo de vida ngOnChanges
    directive.ngOnChanges({
      supermarket: new SimpleChange(null, mockSupermarket, true)
    });

    expect(mockRenderer2.setStyle).toHaveBeenCalledWith(mockElementRef.nativeElement, '--color-primary', '#ff5733');
    expect(mockRenderer2.setStyle).toHaveBeenCalledWith(mockElementRef.nativeElement, '--color-secondary', '#33ff57');
    expect(mockRenderer2.setStyle).toHaveBeenCalledWith(mockElementRef.nativeElement, '--color-primary-rgb', '255, 87, 51');
    expect(mockRenderer2.setStyle).toHaveBeenCalledWith(mockElementRef.nativeElement, '--color-secondary-rgb', '51, 255, 87');
  });

  it('deve aplicar cores padrão se corPrimariaHex ou corSecundariaHex estiverem vazios', () => {
    const mockSupermarket: SupermarketResponse = {
      id: 'super-1',
      nomeFantasia: 'Mercado Teste',
      cnpj: '12345678000199',
      telefone: '11999999999',
      email: 'contato@mercado.com',
      status: 'ATIVO',
      corPrimariaHex: '',
      corSecundariaHex: '',
      urlLogomarca: '',
      endereco: 'Rua Principal, 123',
      latitude: -15.78,
      longitude: -47.92,
      raioAtuacao: 10,
      gestorId: 'gestor-1'
    };

    directive.supermarket = mockSupermarket;

    directive.ngOnChanges({
      supermarket: new SimpleChange(null, mockSupermarket, true)
    });

    expect(mockRenderer2.setStyle).toHaveBeenCalledWith(mockElementRef.nativeElement, '--color-primary', '#16a34a');
    expect(mockRenderer2.setStyle).toHaveBeenCalledWith(mockElementRef.nativeElement, '--color-secondary', '#0284c7');
  });

  it('deve lidar corretamente com hexadecimais inválidos convertendo para padrão 0, 0, 0 no RGB', () => {
    const mockSupermarket: SupermarketResponse = {
      id: 'super-1',
      nomeFantasia: 'Mercado Teste',
      cnpj: '12345678000199',
      telefone: '11999999999',
      email: 'contato@mercado.com',
      status: 'ATIVO',
      corPrimariaHex: 'invalid-hex',
      corSecundariaHex: 'invalid-hex',
      urlLogomarca: '',
      endereco: 'Rua Principal, 123',
      latitude: -15.78,
      longitude: -47.92,
      raioAtuacao: 10,
      gestorId: 'gestor-1'
    };

    directive.supermarket = mockSupermarket;

    directive.ngOnChanges({
      supermarket: new SimpleChange(null, mockSupermarket, true)
    });

    expect(mockRenderer2.setStyle).toHaveBeenCalledWith(mockElementRef.nativeElement, '--color-primary-rgb', '0, 0, 0');
    expect(mockRenderer2.setStyle).toHaveBeenCalledWith(mockElementRef.nativeElement, '--color-secondary-rgb', '0, 0, 0');
  });
});
