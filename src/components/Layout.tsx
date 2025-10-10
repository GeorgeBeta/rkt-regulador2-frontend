import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(apiService.isAuthenticated());
  }, []);

  const handleLogout = () => {
    apiService.logout();
    window.location.href = '/';
  };

  if (isAuthenticated === null) {
    return <div>{children}</div>;
  }

  if (!isAuthenticated) {
    return <div>{children}</div>;
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>RKT Regulador</h1>
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="/inicio" className={currentPage === 'inicio' ? 'active' : ''}>Inicio</a></li>
          <li><a href="/subir-pedido" className={currentPage === 'subir-pedido' ? 'active' : ''}>Subir pedido</a></li>
          <li><a href="/ver-pedidos" className={currentPage === 'ver-pedidos' ? 'active' : ''}>Ver pedidos</a></li>
          <li><a href="/usuarios" className={currentPage === 'usuarios' ? 'active' : ''}>Usuarios</a></li>
          <li><button onClick={handleLogout} className="logout-btn">Salir</button></li>
        </ul>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}