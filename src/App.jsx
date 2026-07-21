import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import { Anchor } from 'lucide-react';
import './index.css';

function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="navbar">
          <div className="container navbar-container">
            <Link to="/" className="navbar-logo">
              <Anchor size={32} color="var(--color-secondary)" />
              Chumbada <span>Oficial</span>
            </Link>
            <nav>
              <Link to="/" className="btn btn-outline" style={{ border: 'none' }}>Catálogo</Link>
            </nav>
          </div>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:handle" element={<ProductDetails />} />
          </Routes>
        </main>
        
        <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '3rem 0', marginTop: '4rem' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <Anchor size={48} style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Chumbada Oficial</h3>
            <p style={{ color: 'var(--color-border)', opacity: 0.7 }}>O melhor equipamento para a sua pescaria esportiva.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
