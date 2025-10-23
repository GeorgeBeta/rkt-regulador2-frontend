import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Layout from './Layout';
import Login from './Login';
import Register from './Register';
import VerifyEmail from './VerifyEmail';
import FileUpload from './FileUpload';
import PedidosList from './PedidosList';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [registrationEmail, setRegistrationEmail] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setCurrentPage(apiService.getCurrentPage());
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('inicio');
  };

  const handleGoToRegister = () => {
    setCurrentPage('register');
  };

  const handleRegister = (email: string) => {
    setRegistrationEmail(email);
    setCurrentPage('verify-email');
  };

  const handleVerified = () => {
    setIsAuthenticated(true);
    setCurrentPage('inicio');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const handleBackToRegister = () => {
    setCurrentPage('register');
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    apiService.setCurrentPage(page);
  };

  const handleLogout = async () => {
    await apiService.logout();
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    switch (currentPage) {
      case 'register':
        return <Register onRegister={handleRegister} onBackToLogin={handleBackToLogin} />;
      case 'verify-email':
        return <VerifyEmail email={registrationEmail} onVerified={handleVerified} onBackToRegister={handleBackToRegister} />;
      default:
        return <Login onLogin={handleLogin} onGoToRegister={handleGoToRegister} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return (
          <div className="dashboard">
            <h1>Bienvenido a RKT Regulador</h1>
            <div className="dashboard-cards">
              <div className="card">
                <h3>Gestionar Ficheros</h3>
                <p>Sube archivos PDF con los pedidos de la empresa</p>
                <button className="btn" onClick={() => handleNavigation('gestionar-ficheros')}>
                  Ficheros
                </button>
              </div>
              <div className="card">
                <h3>Ver Pedidos</h3>
                <p>Consulta todos los pedidos procesados</p>
                <button className="btn" onClick={() => handleNavigation('ver-pedidos')}>
                  Ver Lista
                </button>
              </div>
              <div className="card">
                <h3>Gestión de Usuarios</h3>
                <p>Administra los usuarios del sistema</p>
                <button className="btn" onClick={() => handleNavigation('usuarios')}>
                  Gestionar
                </button>
              </div>
            </div>
          </div>
        );
      case 'gestionar-ficheros':
        return <FileUpload />;
      case 'ver-pedidos':
        return <PedidosList />;
      case 'usuarios':
        return (
          <div className="users-page">
            <h1>Gestión de Usuarios</h1>
            <p>Funcionalidad de gestión de usuarios - Por implementar</p>
            <div className="placeholder">
              <h3>Próximamente:</h3>
              <ul>
                <li>Lista de usuarios registrados</li>
                <li>Crear nuevos usuarios</li>
                <li>Editar permisos</li>
                <li>Desactivar usuarios</li>
              </ul>
            </div>
          </div>
        );
      default:
        return <div>Página no encontrada</div>;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigation} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  );
}