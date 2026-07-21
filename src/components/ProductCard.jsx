import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const mainImage = product.images[0] || 'https://via.placeholder.com/400?text=Sem+Imagem';
  
  // Format price
  const priceDisplay = product.minPrice > 0 
    ? `R$ ${product.minPrice.toFixed(2).replace('.', ',')}` 
    : 'Consulte';

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-img-wrapper">
        <img 
          src={mainImage} 
          alt={product.title} 
          className="product-card-img"
          loading="lazy"
        />
        {product.tags && product.tags.includes('Lancamento') && (
          <span className="badge badge-new" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            Novo
          </span>
        )}
      </div>
      
      <div className="product-card-content">
        <div className="product-card-category">{product.type || 'Acessórios'}</div>
        <h3 className="product-card-title">{product.title}</h3>
        
        {/* Colors Preview */}
        {product.options['Cor'] && product.options['Cor'].length > 0 && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            {product.options['Cor'].length} Cores Disponíveis
          </div>
        )}

        <div className="product-card-footer">
          <div className="product-card-price">{priceDisplay}</div>
          <span className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Detalhes
          </span>
        </div>
      </div>
    </Link>
  );
}
