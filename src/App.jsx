import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import { Anchor, Moon, Sun } from 'lucide-react';
import './index.css';

function App() {
  const [theme, setTheme] = useState('light');

  // Initialize theme based on system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = prefersDark ? 'dark' : 'light';
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
  };

  return (
    <HashRouter>
      <div className="app">
        <header className="navbar">
          <div className="container navbar-container">
            <Link to="/" className="navbar-logo">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Chumbada Oficial" style={{ height: '48px' }} />
            </Link>
            <nav>
              <Link to="/" className="btn btn-outline" style={{ border: 'none' }}>Catálogo</Link>
            </nav>
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn btn-outline" aria-label="Toggle theme" style={{ border: 'none', display: 'flex', alignItems: 'center' }}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
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
