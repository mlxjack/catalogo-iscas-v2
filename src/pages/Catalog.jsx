import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadProducts } from '../utils/csvParser';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await loadProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Set click listener to close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setDropdownOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.type).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.type && product.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || product.type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProduct = products.find(p => p.tags && p.tags.includes('Destaque')) || products[0];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <style>{`
          .spinner {
            border: 3px solid rgba(0, 0, 0, 0.05);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: var(--color-brand);
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="view-fade">
      {/* Hero Section */}
      <section className="hero" aria-label="Apresentação do Catálogo">
        <div className="hero-container">
          <div className="hero-content">
            <span className="badge-tag">Edição Oficial 2026</span>
            <h1 className="hero-title">Iscas de <span>Alta Performance</span></h1>
            <p className="hero-desc">
              Explore o novo Catálogo de Iscas da Chumbada Oficial. Desenvolvido no padrão das grandes marcas mundiais, trazendo riqueza de detalhes, fotos e as especificações técnicas completas de nossas iscas esportivas de alta performance.
            </p>
            <div className="hero-actions">
              <a href="#catalogo-secao" className="btn btn-primary">Ver Catálogo</a>
              <a href="https://chumbadas.com.br" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Visitar Loja</a>
            </div>
          </div>
          
          {/* Featured Card */}
          {featuredProduct && (
            <div className="hero-card" aria-label="Destaque">
              <Link to={`/product/${featuredProduct.id}`}>
                <div className="hero-card-media">
                  <img src={featuredProduct.images[0] || `${import.meta.env.BASE_URL}logo.png`} alt={featuredProduct.title} />
                </div>
              </Link>
              <div className="hero-card-body">
                <div className="hero-card-info">
                  <h3>{featuredProduct.title}</h3>
                  <p>{featuredProduct.type || 'Iscas'}</p>
                </div>
                <span className="hero-card-badge">Destaque</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="main-wrap" id="catalogo-secao" style={{ paddingTop: '3rem' }}>
        {/* Search and Filters Panel */}
        <section className="panel" aria-label="Painel de Busca e Filtros">
          <div className="tools">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="search" 
                className="search-input" 
                placeholder="O que você está procurando?" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />
            </div>
            
            <div className="menu-dropdown-wrapper">
              <button 
                className="hamburger-menu-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }} 
                type="button" 
                aria-expanded={dropdownOpen} 
                aria-label="Menu de Categorias"
              >
                <svg className="hamburger-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <span>{filterCategory === 'All' ? 'Todos' : filterCategory}</span>
                <svg 
                  className="chevron-icon" 
                  viewBox="0 0 24 24" 
                  width="16" height="16" 
                  stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" 
                  style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className={`categories-dropdown ${dropdownOpen ? 'active' : ''}`}>
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    className={`dropdown-item ${filterCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setFilterCategory(cat);
                      setDropdownOpen(false);
                    }}
                    type="button"
                  >
                    {cat === 'All' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Summary Status Bar */}
        <div className="summary-bar">
          <div className="summary-title">
            <h2>Nossas Iscas</h2>
            <p>Selecione uma isca artificial para ver tamanhos, cores disponíveis, fotos detalhadas e solicitar orçamento.</p>
          </div>
          <div className="summary-count">
            {filteredProducts.length} produto{filteredProducts.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Grid of Products */}
        {filteredProducts.length === 0 ? (
          <div className="empty-results">
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '48px', height: '48px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3>Nenhuma isca encontrada</h3>
            <p>Tente buscar por termos diferentes ou selecione outra categoria.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
