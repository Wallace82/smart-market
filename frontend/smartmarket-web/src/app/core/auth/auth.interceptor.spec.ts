import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve adicionar o cabeçalho Authorization se houver um token e não for rota de login/registro', (done) => {
    const token = 'my-test-jwt-token';
    localStorage.setItem('token', token);

    httpClient.get('/api/v1/users/me').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/api/v1/users/me');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('não deve adicionar o cabeçalho Authorization se o token não existir', (done) => {
    httpClient.get('/api/v1/users/me').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/api/v1/users/me');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('não deve adicionar o cabeçalho Authorization se a rota for de login (/auth/login) mesmo com token presente', (done) => {
    localStorage.setItem('token', 'expired-or-other-token');

    httpClient.post('/api/v1/auth/login', {}).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('não deve adicionar o cabeçalho Authorization se a rota for de registro (/auth/register) mesmo com token presente', (done) => {
    localStorage.setItem('token', 'expired-or-other-token');

    httpClient.post('/api/v1/auth/register', {}).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/api/v1/auth/register');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
