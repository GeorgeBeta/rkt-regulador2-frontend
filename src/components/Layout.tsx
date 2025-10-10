import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export default function Layout({ children, currentPage, onNavigate, onLogout }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Si no hay funciones de navegación, es el login
  if (!onNavigate || !onLogout) {
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
          <li><button onClick={() => handleNavigation('inicio')} className={`nav-btn ${currentPage === 'inicio' ? 'active' : ''}`}>Inicio</button></li>
          <li><button onClick={() => handleNavigation('subir-pedido')} className={`nav-btn ${currentPage === 'subir-pedido' ? 'active' : ''}`}>Subir pedido</button></li>
          <li><button onClick={() => handleNavigation('ver-pedidos')} className={`nav-btn ${currentPage === 'ver-pedidos' ? 'active' : ''}`}>Ver pedidos</button></li>
          <li><button onClick={() => handleNavigation('usuarios')} className={`nav-btn ${currentPage === 'usuarios' ? 'active' : ''}`}>Usuarios</button></li>
          <li><button onClick={handleLogout} className="logout-btn">Salir</button></li>
        </ul>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}