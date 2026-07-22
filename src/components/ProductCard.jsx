import React from 'react';
import { Link } from 'react-router-dom';
import { getColorImage } from '../utils/colorHelper';
import { lureColorManifest } from '../utils/lureColorImages';

export default function ProductCard({ product }) {
  const localImg = product.id && lureColorManifest[product.id] ? Object.values(lureColorManifest[product.id])[0] : null;
  const mainImage = localImg ? `${import.meta.env.BASE_URL}${localImg}` : (product.images[0] || `${import.meta.env.BASE_URL}logo.png`);
  
  // Format price
  const priceDisplay = product.minPrice > 0 
    ? `R$ ${product.minPrice.toFixed(2).replace('.', ',')}` 
    : 'Consulte';

  return (
    <article className="product-card">
      <div className="product-card-media">
        <Link to={`/product/${product.id}`}>
          <img 
            src={mainImage} 
            alt={product.title} 
            loading="lazy"
            onError={(e) => { e.target.src = `${import.meta.env.BASE_URL}logo.png`; }}
          />
        </Link>
      </div>
      
      <div className="product-card-content">
        <span className="product-card-cat">{product.type || 'Iscas'}</span>
        <h3 className="product-card-title">
          <Link to={`/product/${product.id}`}>
            {product.title}
          </Link>
        </h3>
        
        {/* Color swatches preview inside card */}
        {product.options['Cor'] && product.options['Cor'].length > 0 && (
          <div className="product-card-previews">
            <div className="card-swatches" aria-label="Cores disponíveis">
              {product.options['Cor'].slice(0, 8).map(color => {
                const imgUrl = getColorImage(color);
                return (
                  <span 
                    key={color} 
                    className="card-swatch" 
                    style={imgUrl ? { backgroundImage: `url("${encodeURI(imgUrl)}")` } : { backgroundColor: '#e2e8f0' }} 
                    title={color}
                  />
                );
              })}
              {product.options['Cor'].length > 8 && (
                <span className="card-vars-count" style={{ fontSize: '10px', marginLeft: '4px' }}>
                  +{product.options['Cor'].length - 8}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="product-card-footer">
          <span className="product-card-price">{priceDisplay}</span>
          <Link to={`/product/${product.id}`} className="product-card-action">
            Ver Detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
