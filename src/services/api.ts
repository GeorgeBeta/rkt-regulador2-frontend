// Servicio centralizado para todas las llamadas API
export interface User {
  email: string;
  password: string;
}

export interface Pedido {
  id: string;
  filename: string;
  uploadDate: string;
  status: string;
}

class ApiService {
  private baseUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';
  private isMock = import.meta.env.PUBLIC_IS_MOCK === 'true';

  // Autenticación
  async login(email: string, password: string): Promise<{ success: boolean; token?: string }> {
    if (this.isMock && email === 'demo@rkt-regulador.com' && password === 'demo123') {
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('currentPage', 'inicio');
      return { success: true, token: 'mock-token' };
    }
    
    // TODO: Implementar llamada real a Cognito
    throw new Error('Autenticación real no implementada aún');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentPage');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getCurrentPage(): string {
    return localStorage.getItem('currentPage') || 'login';
  }

  setCurrentPage(page: string): void {
    localStorage.setItem('currentPage', page);
  }

  // Subir pedidos
  async uploadPedido(file: File): Promise<{ success: boolean; message: string }> {
    if (this.isMock) {
      return { success: true, message: 'Archivo subido correctamente (mock)' };
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseUrl}/pedidos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    });
    
    return response.json();
  }

  // Obtener pedidos
  async getPedidos(): Promise<Pedido[]> {
    if (this.isMock) {
      return [
        { id: '1', filename: 'pedido-001.pdf', uploadDate: '2024-01-15', status: 'Procesado' },
        { id: '2', filename: 'pedido-002.pdf', uploadDate: '2024-01-16', status: 'Pendiente' }
      ];
    }
    
    const response = await fetch(`${this.baseUrl}/pedidos`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    return response.json();
  }

  // Gestión de usuarios (placeholder)
  async getUsers(): Promise<any[]> {
    if (this.isMock) {
      return [
        { id: '1', email: 'demo@rkt-regulador.com', role: 'admin' },
        { id: '2', email: 'user@rkt-regulador.com', role: 'user' }
      ];
    }
    
    const response = await fetch(`${this.baseUrl}/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    return response.json();
  }
}

export const apiService = new ApiService();