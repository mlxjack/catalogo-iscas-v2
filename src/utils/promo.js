// Promocao de Setembro/2026: 12% OFF nas cores Preto Brilhante, Amarelo Neon,
// Glow e Branco Perola, entre 01/09 e 30/09/2026. Ativa/desativa sozinha
// com base na data local do visitante -- nao precisa de nenhuma acao manual
// no dia em que comeca ou termina.

const PROMO_START = new Date(2026, 8, 1, 0, 0, 0);   // 1 de setembro de 2026, 00:00
const PROMO_END = new Date(2026, 8, 30, 23, 59, 59); // 30 de setembro de 2026, 23:59
const PROMO_DISCOUNT = 0.12; // 12%

const PROMO_COLORS = ['Preto Brilhante', 'Amarelo Neon', 'Glow', 'Branco Pérola'];

const normalize = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const PROMO_COLORS_NORM = new Set(PROMO_COLORS.map(normalize));

export const isPromoActive = () => {
  const now = new Date();
  return now >= PROMO_START && now <= PROMO_END;
};

export const isPromoColor = (colorName) => PROMO_COLORS_NORM.has(normalize(colorName));

export const getPromoPrice = (price) => Math.round(price * (1 - PROMO_DISCOUNT) * 100) / 100;

export const PROMO_LABEL_COLORS = PROMO_COLORS;
export const PROMO_DISCOUNT_PCT = Math.round(PROMO_DISCOUNT * 100);
