import { signUp, confirmSignUp, signIn, signOut, getCurrentUser, resendSignUpCode } from 'aws-amplify/auth';
import '../lib/amplify';

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
    
    try {
      const { isSignedIn } = await signIn({ username: email, password });
      if (isSignedIn) {
        localStorage.setItem('currentPage', 'inicio');
        return { success: true };
      }
      throw new Error('Login failed');
    } catch (error: any) {
      throw new Error(error.message || 'Error de autenticación');
    }
  }

  async logout(): Promise<void> {
    if (this.isMock) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentPage');
      return;
    }
    
    try {
      await signOut();
      localStorage.removeItem('currentPage');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (this.isMock) {
      return !!localStorage.getItem('authToken');
    }
    
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  getCurrentPage(): string {
    return localStorage.getItem('currentPage') || 'login';
  }

  setCurrentPage(page: string): void {
    localStorage.setItem('currentPage', page);
  }

  // Registro de usuarios
  async register(name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
    if (this.isMock) {
      return { success: true, message: 'Cuenta creada correctamente' };
    }
    
    try {
      console.log('Intentando registrar usuario:', { email, name });
      
      const { isSignUpComplete } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });
      
      console.log('Registro exitoso:', { isSignUpComplete });
      
      return { 
        success: true, 
        message: isSignUpComplete ? 'Cuenta creada correctamente' : 'Verificación requerida'
      };
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.message || 'Error al crear la cuenta');
    }
  }

  // Verificación de email
  async verifyEmail(email: string, code: string): Promise<{ success: boolean; message?: string }> {
    if (this.isMock) {
      if (code === '123456') {
        return { success: true, message: 'Email verificado correctamente' };
      }
      throw new Error('Código inválido');
    }
    
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      
      return { 
        success: isSignUpComplete, 
        message: 'Email verificado correctamente'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Código inválido o expirado');
    }
  }

  // Reenviar código de verificación
  async resendVerificationCode(email: string): Promise<{ success: boolean; message?: string }> {
    if (this.isMock) {
      return { success: true, message: 'Código reenviado' };
    }
    
    try {
      await resendSignUpCode({ username: email });
      return { success: true, message: 'Código reenviado correctamente' };
    } catch (error: any) {
      throw new Error(error.message || 'Error al reenviar el código');
    }
  }

  // Obtener ID del usuario actual
  async getCurrentUserId(): Promise<string> {
    if (this.isMock) {
      return 'mock-user-id';
    }
    
    try {
      const user = await getCurrentUser();
      return user.userId;
    } catch {
      throw new Error('Usuario no autenticado');
    }
  }

  // Subir pedidos
  async uploadPedido(file: File): Promise<{ success: boolean; message: string }> {
    if (this.isMock) {
      return { success: true, message: 'Archivo subido correctamente (mock)' };
    }
    
    try {
      const userId = await this.getCurrentUserId();
      const serverUrl = import.meta.env.PUBLIC_SERVER_URL;
      
      const filename = file.name;
      const ordername = filename.match(/PV\d{7}/)?.[0];
      
      if (!ordername) {
        throw new Error('El archivo no contiene un número de pedido válido (formato: PV seguido de 7 dígitos)');
      }

      const response = await fetch(`${serverUrl}/filepdfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "filePdfName": ordername,
          "userId": userId
        })
      });
      
      if (response.ok) {
        return { success: true, message: 'Archivo procesado correctamente' };
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Error al procesar el archivo');
    }
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