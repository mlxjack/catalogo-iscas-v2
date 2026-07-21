import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadProducts } from '../utils/csvParser';
import { getColorImage } from '../utils/colorHelper';

export default function ProductDetails() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await loadProducts();
        const found = data.find(p => p.id === handle);
        if (found) {
          // Filter out color swatch images from the product details gallery
          const cleanImages = found.images.filter(img => {
            const urlNoParams = img.split('?')[0];
            const urlFileName = urlNoParams.substring(urlNoParams.lastIndexOf('/') + 1);
            const urlFileNameNoExt = urlFileName.substring(0, urlFileName.lastIndexOf('.'));
            const normalizedName = urlFileNameNoExt.toLowerCase().replace(/[^a-z0-9]/g, "");
            
            // Check if it matches any swatch filename
            const swatchesList = [
              "beijodasombra", "brancoperola", "capimrubi", "chapastel", "chaverde", "cha", 
              "glow", "luzlaranja", "rapadura", "roxoestelar", "rubidourado", "salmaoradiante", 
              "verdeneon", "verdecosmico", "vermelhoholografico", "veudanoite", "amareloneon", 
              "laranjaneon", "pretobrilhante"
            ];
            return !swatchesList.includes(normalizedName);
          });
          
          found.images = cleanImages.length > 0 ? cleanImages : [found.images[0]];

          setProduct(found);
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

  useEffect(() => {
    if (product && Object.keys(selectedOptions).length > 0) {
      const matchedVariant = product.variants.find(v => {
        let match = true;
        const optionKeys = Object.keys(product.options);
        if (optionKeys[0] && v.option1 !== selectedOptions[optionKeys[0]]) match = false;
        if (optionKeys[1] && v.option2 !== selectedOptions[optionKeys[1]]) match = false;
        if (optionKeys[2] && v.option3 !== selectedOptions[optionKeys[2]]) match = false;
        return match;
      });
      setCurrentVariant(matchedVariant || product.variants[0]);
      if (matchedVariant && matchedVariant.image) {
        const imgIndex = product.images.findIndex(i => i === matchedVariant.image);
        if (imgIndex !== -1) setActiveImage(imgIndex);
      }
    }
  }, [selectedOptions, product]);

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

  if (!product) {
    return (
      <div className="main-wrap" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Produto não encontrado</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Voltar ao Catálogo</Link>
      </div>
    );
  }

  const handleOptionSelect = (optionName, value) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const displayPrice = currentVariant && currentVariant.price > 0
    ? `R$ ${currentVariant.price.toFixed(2).replace('.', ',')}`
    : 'Consulte Preço';

  const getWhatsAppLink = () => {
    const selectedOptionsStr = Object.entries(selectedOptions)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
    const text = `Olá! Gostaria de saber mais sobre a isca: ${product.title}${selectedOptionsStr ? ` (${selectedOptionsStr})` : ''}`;
    return `https://wa.me/5511941900602?text=${encodeURIComponent(text)}`;
  };

  const buildSpecs = () => {
    const specs = [
      { label: 'Categoria', value: product.type || 'Iscas Artificiais' },
      { label: 'Fabricante', value: product.vendor || 'Chumbada Oficial' },
    ];
    if (currentVariant?.sku) specs.push({ label: 'SKU', value: currentVariant.sku });
    const optionKeys = Object.keys(product.options);
    optionKeys.forEach(key => {
      const val = selectedOptions[key];
      if (val) specs.push({ label: key, value: val });
    });
    if (currentVariant?.grams > 0) specs.push({ label: 'Peso', value: `${currentVariant.grams}g` });
    if (product.title.toLowerCase().includes('soft') || product.description.toLowerCase().includes('soft bait') || product.description.toLowerCase().includes('silicone')) {
      specs.push({ label: 'Material', value: 'Plastisol (Soft Bait)' });
    } else if (product.title.toLowerCase().includes('jig') || product.title.toLowerCase().includes('chumbo')) {
      specs.push({ label: 'Material', value: 'Chumbo + Anzol Reforçado' });
    }
    const descLower = product.description.toLowerCase();
    const species = [];
    if (descLower.includes('tucunaré') || descLower.includes('tucunare')) species.push('Tucunaré');
    if (descLower.includes('robalo')) species.push('Robalo');
    if (descLower.includes('traíra') || descLower.includes('traira')) species.push('Traíra');
    if (descLower.includes('dourado')) species.push('Dourado');
    if (descLower.includes('black bass') || descLower.includes('bass')) species.push('Black Bass');
    if (descLower.includes('xaréu') || descLower.includes('xareu')) species.push('Xaréu');
    if (descLower.includes('tarpon') || descLower.includes('camurupim')) species.push('Tarpon');
    if (species.length > 0) specs.push({ label: 'Espécies', value: species.join(', ') });
    return specs;
  };

  return (
    <div className="view-fade">
      <main className="main-wrap detail-view">
        {/* Breadcrumb nav */}
        <nav className="breadcrumb" aria-label="Navegação de trilha">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/" onClick={() => {}}>{product.type || 'Iscas'}</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current" aria-current="page">{product.title}</span>
        </nav>

        <div className="detail-grid">
          {/* Left Column: Gallery */}
          <section className="detail-gallery" aria-label="Imagens do Produto">
            <div className="gallery-main" id="gallery-main-container">
              {product.images.length > 0
                ? <img id="main-product-img" src={product.images[activeImage]} alt={product.title} />
                : <div className="pd-no-img">Sem imagem</div>
              }
            </div>
            
            {product.images.length > 1 && (
              <div className="gallery-thumbs" id="gallery-thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb-btn ${i === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    type="button"
                    aria-label={`Ver imagem ${i + 1}`}
                  >
                    <img src={img} alt={`Miniatura ${i + 1}`} onError={(e) => { e.target.src = `${import.meta.env.BASE_URL}logo.png`; }} />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Right Column: Info & Details */}
          <section className="detail-info" aria-label="Informações do Produto">
            <div className="info-header">
              <span className="info-cat">{product.type || 'Iscas'}</span>
              <h1 className="info-title">{product.title}</h1>
              
              <div className="info-price-wrapper">
                <span className="info-price-label">Preço de Referência:</span>
                <span className="info-price">{displayPrice}</span>
              </div>
            </div>

            {/* Options Selector Grid */}
            {Object.keys(product.options).map(optionName => {
              const values = product.options[optionName];
              if (!values || values.length === 0) return null;
              const isColor = optionName.toLowerCase().includes('cor') || optionName.toLowerCase().includes('color');

              return (
                <div key={optionName} className="info-section">
                  <h2 className="info-section-title">
                    {optionName}: <span className="info-section-value">{selectedOptions[optionName]}</span>
                  </h2>

                  {isColor ? (
                    <div className="swatches-selector" role="radiogroup" aria-label={`Seleção de ${optionName}`}>
                      {values.map(val => {
                        const imgUrl = getColorImage(val);
                        return (
                          <button
                            key={val}
                            className={`swatch-btn ${selectedOptions[optionName] === val ? 'active' : ''}`}
                            style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : { backgroundColor: '#e2e8f0' }}
                            onClick={() => handleOptionSelect(optionName, val)}
                            title={val}
                            type="button"
                            role="radio"
                            aria-checked={selectedOptions[optionName] === val ? 'true' : 'false'}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="vars-selector" role="radiogroup" aria-label={`Seleção de ${optionName}`}>
                      {values.map(val => (
                        <button
                          key={val}
                          className={`var-btn ${selectedOptions[optionName] === val ? 'active' : ''}`}
                          onClick={() => handleOptionSelect(optionName, val)}
                          type="button"
                          role="radio"
                          aria-checked={selectedOptions[optionName] === val ? 'true' : 'false'}
                        >
                          <span className="var-name">{val}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Technical Specs */}
            <div className="info-section">
              <h2 className="info-section-title">Especificações Técnicas</h2>
              <table className="specs-table">
                <tbody>
                  {buildSpecs().map((spec, i) => (
                    <tr key={i}>
                      <td className="specs-label">{spec.label}</td>
                      <td className="specs-val">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Description */}
            {product.description && (
              <div className="info-section">
                <h2 className="info-section-title">Descrição</h2>
                <div className="info-desc" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* CTA Actions */}
            <div className="detail-actions">
              <button 
                className="btn btn-primary btn-whatsapp" 
                onClick={() => window.open(getWhatsAppLink(), '_blank', 'noopener noreferrer')}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.86.001-2.638-1.024-5.117-2.884-6.979C16.59 1.905 14.113.882 11.48.882c-5.441 0-9.863 4.42-9.865 9.861 0 1.682.454 3.32 1.317 4.757l-.988 3.605 3.702-.971zm11.367-7.252c-.3-.149-1.777-.875-2.05-.974-.274-.1-.474-.149-.674.15-.2.299-.774.974-.949 1.173-.174.199-.349.224-.648.075-.3-.15-1.263-.465-2.403-1.482-.888-.793-1.488-1.77-1.663-2.069-.175-.299-.019-.461.13-.61.135-.134.3-.349.449-.523.149-.174.199-.299.299-.498.1-.2.05-.374-.025-.523-.075-.15-.674-1.62-.924-2.22-.243-.585-.49-.507-.674-.516-.174-.008-.374-.01-.574-.01-.2 0-.524.075-.798.374-.274.299-1.048 1.022-1.048 2.492 0 1.47 1.073 2.89 1.223 3.089.15.2 2.11 3.22 5.111 4.516.713.308 1.27.493 1.704.63.716.228 1.368.196 1.883.119.574-.085 1.777-.726 2.025-1.42.249-.696.249-1.293.174-1.418-.075-.125-.274-.199-.573-.349z"/>
                </svg>
                Solicitar via WhatsApp
              </button>

              <div className="action-row">
                <a href="https://chumbadas.com.br" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  Comprar no Site
                </a>
                <Link to="/" className="btn btn-secondary">
                  Voltar ao Catálogo
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
