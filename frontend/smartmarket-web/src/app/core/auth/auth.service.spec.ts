import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials, LoginResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  // Token JWT de teste válido (contém payload decodificável em base64)
  // Payload: {"id":"user-123","sub":"test@smartmarket.com","roles":["ROLE_MANAGER"]}
  const mockToken = 'header.' + btoa(JSON.stringify({
    id: 'user-123',
    sub: 'test@smartmarket.com',
    roles: ['ROLE_MANAGER']
  })) + '.signature';

  beforeEach(() => {
    // Limpar localStorage antes de cada teste para isolamento total
    localStorage.clear();

    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Inicialização', () => {
    it('deve carregar o usuário se um token válido já existir no localStorage', () => {
      // Configurar token antes de inicializar o serviço
      localStorage.setItem('token', mockToken);
      
      // Criar nova instância para forçar o construtor a rodar
      const newService = TestBed.runInInjectionContext(() => new AuthService(TestBed.inject(Router) as any));
      
      expect(newService.isAuthenticated()).toBeTrue();
      expect(newService.user()).toEqual({
        id: 'user-123',
        email: 'test@smartmarket.com',
        roles: ['ROLE_MANAGER']
      });
    });

    it('não deve autenticar se nenhum token estiver no localStorage', () => {
      expect(service.isAuthenticated()).toBeFalse();
      expect(service.user()).toBeNull();
    });
  });

  describe('login', () => {
    const credentials: LoginCredentials = {
      email: 'manager@smartmarket.com',
      password: 'password123'
    };

    it('deve fazer login com sucesso, armazenar o token e decodificar o usuário', (done) => {
      const mockResponse: LoginResponse = {
        accessToken: mockToken
      };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('token')).toBe(mockToken);
        expect(service.isAuthenticated()).toBeTrue();
        expect(service.user()?.email).toBe('test@smartmarket.com');
        done();
      });

      const req = httpMock.expectOne('/api/v1/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: credentials.email,
        password: credentials.password
      });

      req.flush(mockResponse);
    });

    it('deve lidar com erros de login sem salvar dados', (done) => {
      service.login(credentials).subscribe({
        next: () => fail('Deveria ter falhado com erro'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(localStorage.getItem('token')).toBeNull();
          expect(service.isAuthenticated()).toBeFalse();
          done();
        }
      });

      const req = httpMock.expectOne('/api/v1/auth/login');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('deve enviar requisição de registro com dados mapeados corretamente', (done) => {
      const registerData = {
        nome: 'Manager User',
        email: 'manager@test.com',
        senha: 'password',
        papel: 'MANAGER'
      };

      service.register(registerData).subscribe(response => {
        expect(response).toEqual({ success: true });
        done();
      });

      const req = httpMock.expectOne('/api/v1/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        nome: registerData.nome,
        email: registerData.email,
        senha: registerData.senha,
        papel: registerData.papel
      });

      req.flush({ success: true });
    });
  });

  describe('logout', () => {
    it('deve limpar localStorage, resetar o sinal de usuário e redirecionar para a tela de login', () => {
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', 'dummyUser');

      // Força o estado a ser autenticado
      service.login({ email: 'a', password: 'b' }).subscribe();
      const req = httpMock.expectOne('/api/v1/auth/login');
      req.flush({ accessToken: mockToken });

      expect(service.isAuthenticated()).toBeTrue();

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Decodificação de Token', () => {
    it('deve deslogar e limpar dados caso a decodificação do token falhe com erro', () => {
      const invalidToken = 'invalid.jwt.token';
      
      // Tentamos decodificar chamando login ou inicializando
      localStorage.setItem('token', invalidToken);
      
      const newService = TestBed.runInInjectionContext(() => new AuthService(TestBed.inject(Router) as any));
      
      expect(newService.isAuthenticated()).toBeFalse();
      expect(newService.user()).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
