import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import './index.css';

function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="main-header">
          <div className="header-container">
            <Link to="/" className="logo-link">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Chumbada Oficial Logo" className="brand-logo" />
            </Link>
            
            <nav className="nav-menu" aria-label="Navegação Principal">
              <Link to="/" className="nav-item active">Produtos</Link>
              <a href="https://chumbadas.com.br" target="_blank" rel="noopener noreferrer" className="nav-item btn-nav">Site Oficial</a>
            </nav>
          </div>
        </header>
        
        <main className="app-container">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:handle" element={<ProductDetails />} />
          </Routes>
        </main>
        
        <footer className="main-footer">
          <div className="footer-container">
            <div className="footer-brand">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Chumbada Oficial Logo" className="footer-logo" style={{ height: '38px', width: 'auto', backgroundColor: '#ffffff', padding: '2px', borderRadius: '6px' }} />
              <p className="footer-desc">Catálogo de referência oficial para revendedores, parceiros e entusiastas da pesca esportiva de alta performance.</p>
            </div>
            
            <div className="footer-links">
              <h4 className="footer-title">Links Úteis</h4>
              <ul>
                <li><a href="https://chumbadas.com.br" target="_blank" rel="noopener noreferrer">Loja Oficial</a></li>
                <li><a href="https://www.instagram.com/chumbadaoficial/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://wa.me/5511941900602" target="_blank" rel="noopener noreferrer">WhatsApp Suporte</a></li>
              </ul>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; 2026 Chumbada Oficial. Todos os direitos reservados. Design premium e esportivo.</p>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
