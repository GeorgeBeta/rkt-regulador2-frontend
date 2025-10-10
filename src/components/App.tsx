import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Layout from './Layout';
import Login from './Login';
import FileUpload from './FileUpload';
import PedidosList from './PedidosList';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const authenticated = apiService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      setCurrentPage(apiService.getCurrentPage());
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('inicio');
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    apiService.setCurrentPage(page);
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return (
          <div className="dashboard">
            <h1>Bienvenido a RKT Regulador</h1>
            <div className="dashboard-cards">
              <div className="card">
                <h3>Subir Pedido</h3>
                <p>Sube archivos PDF con los pedidos de la empresa</p>
                <button className="btn" onClick={() => handleNavigation('subir-pedido')}>
                  Ir a Subir
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
      case 'subir-pedido':
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