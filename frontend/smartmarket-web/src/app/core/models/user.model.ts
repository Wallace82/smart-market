export interface UserResponse {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'CLIENT';
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  avatarUrl?: string;
  ultimoAcesso?: string;
  criadoEm?: string;
}

export interface UserRequest {
  nome: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'CLIENT';
  password?: string;
}
