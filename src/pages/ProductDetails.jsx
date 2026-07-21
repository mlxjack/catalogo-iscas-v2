import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadProducts } from '../utils/csvParser';
import { ArrowLeft, Loader2, MessageCircle, ExternalLink } from 'lucide-react';

// List of available color images - exact filenames in public/cores/
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
  "Roxo-Estelar.jpg",
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

const normalizeString = (str) =>
  str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

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
        <Loader2 size={40} color="var(--color-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
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

  const getColorImage = (colorName) => {
    const normalizedTarget = normalizeString(colorName);
    const exactMatch = colorFiles.find(f => {
      const fileNameNoExt = f.substring(0, f.lastIndexOf('.'));
      return normalizeString(fileNameNoExt) === normalizedTarget;
    });
    if (exactMatch) return `${import.meta.env.BASE_URL}cores/${exactMatch}`;
    const fuzzyMatch = colorFiles.find(f => {
      const fileNameNoExt = normalizeString(f.substring(0, f.lastIndexOf('.')));
      return fileNameNoExt.includes(normalizedTarget) || normalizedTarget.includes(fileNameNoExt);
    });
    if (fuzzyMatch) return `${import.meta.env.BASE_URL}cores/${fuzzyMatch}`;
    return null;
  };

  // Build specs from product/variant data
  const buildSpecs = () => {
    const specs = [
      { label: 'Categoria', value: product.type || 'Artigos de Pesca' },
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

  const getWhatsAppLink = () => {
    const selectedOptionsStr = Object.entries(selectedOptions)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
    const text = `Olá! Gostaria de saber mais sobre a isca: ${product.title}${selectedOptionsStr ? ` (${selectedOptionsStr})` : ''}`;
    return `https://wa.me/5511941900602?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="pd-page">
      <div className="pd-container">
        {/* Main Grid */}
        <div className="pd-grid">

          {/* Left Column: Gallery & Description */}
          <div className="pd-left-col">
            <div className="pd-gallery">
              <div className="pd-main-img">
                {product.images.length > 0
                  ? <img src={product.images[activeImage]} alt={product.title} className="fade-in" key={activeImage} />
                  : <div className="pd-no-img">Sem imagem</div>
                }
              </div>
              {product.images.length > 1 && (
                <div className="pd-thumbs">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      className={`pd-thumb ${i === activeImage ? 'active' : ''}`}
                      onClick={() => setActiveImage(i)}
                    >
                      <img src={img} alt={`Foto ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {product.description && (
              <div className="pd-description">
                <h3 className="pd-desc-title">Sobre o Produto</h3>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}
          </div>

          {/* Right Column: Info & Specs */}
          <div className="pd-right-col">
            <div className="pd-info">
              {/* Back link */}
              <Link to="/" className="pd-back">
                <ArrowLeft size={14} />
                Voltar ao catálogo
              </Link>

              {product.type && <span className="pd-type">{product.type}</span>}
              <h1 className="pd-title">{product.title}</h1>
              <div className="pd-price">{displayPrice}</div>

              {/* Options */}
              <div className="pd-options">
                {Object.keys(product.options).map(optionName => {
                  const values = product.options[optionName];
                  if (!values || values.length === 0) return null;
                  const isColor = optionName.toLowerCase().includes('cor') || optionName.toLowerCase().includes('color');

                  return (
                    <div key={optionName} className="pd-option-group">
                      <div className="pd-option-label">
                        {optionName}: <strong>{selectedOptions[optionName]}</strong>
                      </div>

                      {isColor ? (
                        <div className="pd-colors">
                          {values.map(val => {
                            const imgUrl = getColorImage(val);
                            return (
                              <button
                                key={val}
                                className={`pd-color-btn ${selectedOptions[optionName] === val ? 'active' : ''}`}
                                onClick={() => handleOptionSelect(optionName, val)}
                                title={val}
                              >
                                {imgUrl
                                  ? <img src={imgUrl} alt={val} />
                                  : <span className="pd-color-fallback">{val.slice(0, 2)}</span>
                                }
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="pd-sizes">
                          {values.map(val => (
                            <button
                              key={val}
                              className={`pd-size-btn ${selectedOptions[optionName] === val ? 'active' : ''}`}
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
            </div>

            {/* Specs */}
            <div className="pd-specs">
              <h3 className="pd-specs-title">Ficha Técnica</h3>
              <div className="pd-specs-grid">
                {buildSpecs().map((spec, i) => (
                  <div key={i} className="pd-spec-row">
                    <span className="pd-spec-label">{spec.label}</span>
                    <span className="pd-spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pd-ctas">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <MessageCircle size={18} />
                Fazer Pedido (WhatsApp)
              </a>
              <a
                href="https://chumbadas.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-site"
              >
                <ExternalLink size={18} />
                Site Oficial
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
