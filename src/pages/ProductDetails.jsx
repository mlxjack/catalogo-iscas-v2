import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadProducts } from '../utils/csvParser';
import { ArrowLeft, Loader2, ChevronRight, Info } from 'lucide-react';

// List of available color images
const colorFiles = [
  "Beijo-da-sombra.jpg",
  "Branco-perola.jpg",
  "Capim-Rubi.jpg",
  "Chá - Pastel.jpg",
  "Chá-verde.jpg",
  "Chá.jpg",
  "Glow.jpg",
  "Luz-Laranja.jpg",
  "Rapadura.jpg",
  "Roxo-Estrelnar.jpg",
  "Rubi-Dourado.jpg",
  "Salmão-Radiante.jpg",
  "Verde neon.jpg",
  "Verde-cósmico.jpg",
  "Vermelho-Holográfico.jpg",
  "Véu-da-Noite.jpg",
  "amarelo-neon.jpg",
  "laranja-Neon.png",
  "preto-brilhante.png"
];

// Helper to normalize strings for matching
const normalizeString = (str) => {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/g, ""); // remove spaces, dashes, etc
};

export default function ProductDetails() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  
  // Selected options state
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await loadProducts();
        const found = data.find(p => p.id === handle);
        if (found) {
          setProduct(found);
          // Initialize first available options
          const initialOptions = {};
          Object.keys(found.options).forEach(optName => {
            initialOptions[optName] = found.options[optName][0];
          });
          setSelectedOptions(initialOptions);
        }
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [handle]);

  // Update current variant when options change
  useEffect(() => {
    if (product && Object.keys(selectedOptions).length > 0) {
      // Find variant that matches selected options
      const matchedVariant = product.variants.find(v => {
        let match = true;
        const optionKeys = Object.keys(product.options);
        if (optionKeys[0] && v.option1 !== selectedOptions[optionKeys[0]]) match = false;
        if (optionKeys[1] && v.option2 !== selectedOptions[optionKeys[1]]) match = false;
        if (optionKeys[2] && v.option3 !== selectedOptions[optionKeys[2]]) match = false;
        return match;
      });

      setCurrentVariant(matchedVariant || product.variants[0]);
      
      // Update image if variant has a specific image
      if (matchedVariant && matchedVariant.image) {
        const imgIndex = product.images.findIndex(i => i === matchedVariant.image);
        if (imgIndex !== -1) {
          setActiveImage(imgIndex);
        }
      }
    }
  }, [selectedOptions, product]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 size={48} color="var(--color-secondary)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Produto não encontrado</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Voltar ao Catálogo</Link>
      </div>
    );
  }

  const handleOptionSelect = (optionName, value) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const displayPrice = currentVariant && currentVariant.price > 0 
    ? `R$ ${currentVariant.price.toFixed(2).replace('.', ',')}` 
    : 'Consulte Preço';

  // Attempt to match a color name to an image file
  const getColorImage = (colorName) => {
    const normalizedTarget = normalizeString(colorName);
    
    // First, try a direct match after normalization
    const exactMatch = colorFiles.find(f => {
      const fileNameNoExt = f.substring(0, f.lastIndexOf('.'));
      return normalizeString(fileNameNoExt) === normalizedTarget;
    });

    if (exactMatch) return `${import.meta.env.BASE_URL}cores/${exactMatch}`;

    // If no exact match, try fuzzy (if target is included in file name or vice versa)
    const fuzzyMatch = colorFiles.find(f => {
      const fileNameNoExt = normalizeString(f.substring(0, f.lastIndexOf('.')));
      return fileNameNoExt.includes(normalizedTarget) || normalizedTarget.includes(fileNameNoExt);
    });

    if (fuzzyMatch) return `${import.meta.env.BASE_URL}cores/${fuzzyMatch}`;

    return null; // Fallback to normal button if no image is found
  };

  return (
    <div className="container details-page">
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <Link to="/" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ArrowLeft size={16} /> Voltar ao Catálogo
        </Link>
        <ChevronRight size={16} />
        <span>{product.type || 'Produto'}</span>
        <ChevronRight size={16} />
        <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{product.title}</span>
      </div>

      <div className="details-grid">
        {/* Left Col: Gallery */}
        <div className="details-gallery">
          <div className="details-main-img-container">
            {product.images.length > 0 ? (
              <img 
                src={product.images[activeImage]} 
                alt={product.title} 
                className="details-main-img" 
              />
            ) : (
              <div style={{ padding: '4rem', color: 'var(--color-text-muted)' }}>Sem Imagem</div>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="details-thumbnails">
              {product.images.map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`details-thumb ${index === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          )}

          {/* Specifications Table Section */}
          <div className="content-section" style={{ marginTop: '2rem', paddingTop: '2rem' }}>
            <h2 className="section-title">
              <Info size={24} color="var(--color-secondary)" />
              Ficha Técnica
            </h2>
            <div className="specs-table-container">
              <table className="specs-table">
                <tbody>
                  {(() => {
                    const specs = [
                      { label: 'Modelo', value: product.title },
                      { label: 'Categoria', value: product.type || 'Artigos de Pesca' },
                      { label: 'Fabricante', value: product.vendor || 'Chumbada Oficial' },
                    ];

                    if (currentVariant) {
                      if (currentVariant.sku) {
                        specs.push({ label: 'Código SKU', value: currentVariant.sku });
                      }
                      
                      const optionKeys = Object.keys(product.options);
                      optionKeys.forEach((key) => {
                        const val = selectedOptions[key];
                        if (val) {
                          specs.push({ label: key, value: val });
                        }
                      });

                      if (currentVariant.grams > 0) {
                        specs.push({ label: 'Peso Médio', value: `${currentVariant.grams}g` });
                      }
                    }

                    if (product.title.toLowerCase().includes('soft') || product.description.toLowerCase().includes('soft bait') || product.description.toLowerCase().includes('silicone')) {
                      specs.push({ label: 'Composição', value: 'Plastisol de alta performance (Soft Bait)' });
                    } else if (product.title.toLowerCase().includes('jig') || product.title.toLowerCase().includes('chumbo')) {
                      specs.push({ label: 'Composição', value: 'Chumbo de alta pureza e Anzol reforçado' });
                    }

                    const species = [];
                    const descLower = product.description.toLowerCase();
                    if (descLower.includes('tucunaré') || descLower.includes('tucunare')) species.push('Tucunaré');
                    if (descLower.includes('robalo')) species.push('Robalo');
                    if (descLower.includes('traíra') || descLower.includes('traira')) species.push('Traíra');
                    if (descLower.includes('dourado')) species.push('Dourado');
                    if (descLower.includes('black bass') || descLower.includes('bass')) species.push('Black Bass');
                    if (descLower.includes('xaréu') || descLower.includes('xareu')) species.push('Xaréu');
                    if (descLower.includes('tarpon') || descLower.includes('camurupim')) species.push('Tarpon');
                    
                    if (species.length > 0) {
                      specs.push({ label: 'Predadores Indicados', value: species.join(', ') });
                    }

                    return specs.map((spec, i) => (
                      <tr key={i}>
                        <td className="label">{spec.label}</td>
                        <td className="value">{spec.value}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Info */}
        <div className="details-info">
          {product.tags && product.tags.includes('Lancamento') && (
            <span className="badge badge-new" style={{ marginBottom: '1.5rem', alignSelf: 'flex-start' }}>Lançamento</span>
          )}
          
          <h1 className="details-title">{product.title}</h1>
          <div className="details-price">{displayPrice}</div>

          {/* Options */}
          <div className="details-options">
            {Object.keys(product.options).map((optionName, idx) => {
              const values = product.options[optionName];
              if (!values || values.length === 0) return null;

              const isColorOption = optionName.toLowerCase().includes('cor') || optionName.toLowerCase().includes('color');

              return (
                <div key={optionName} style={{ marginBottom: '2rem' }}>
                  <h3 className="details-options-title">
                    Selecionar {optionName}: <span style={{color: 'var(--color-primary)', fontWeight: 800}}>{selectedOptions[optionName]}</span>
                  </h3>
                  
                  {isColorOption ? (
                    <div className="color-swatches">
                      {values.map(val => {
                        const imgUrl = getColorImage(val);
                        return (
                          <div 
                            key={val} 
                            className={`color-swatch-wrapper ${selectedOptions[optionName] === val ? 'active' : ''}`}
                            onClick={() => handleOptionSelect(optionName, val)}
                            title={val}
                          >
                            <div 
                              className="color-swatch" 
                              style={imgUrl ? { backgroundImage: `url('${imgUrl}')` } : { backgroundColor: '#333' }}
                            />
                            <span className="color-name">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="option-group">
                      {values.map(val => (
                        <button
                          key={val}
                          className={`option-btn ${selectedOptions[optionName] === val ? 'active' : ''}`}
                          onClick={() => handleOptionSelect(optionName, val)}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Description Section */}
          <div className="content-section" style={{ borderTop: '2px solid var(--color-border)', paddingTop: '2rem', marginTop: '2rem' }}>
            <h2 className="section-title">Sobre o Produto</h2>
            <div 
              className="details-description"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
