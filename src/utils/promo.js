// Promocao das Cores: 12% OFF nas cores Preto Brilhante, Amarelo Neon,
// Glow e Branco Perola, antecipada para 24/08/2026 (decisao do usuario;
// a arte do banner ainda imprime "01/09 a 30/09" -- aceito assim por ora)
// ate 30/09/2026. Ativa/desativa sozinha com base na data local do
// visitante -- nao precisa de nenhuma acao manual no dia em que comeca
// ou termina.

const PROMO_START = new Date(2026, 7, 24, 0, 0, 0);  // 24 de agosto de 2026, 00:00
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

// Banner especial "Dia do Cliente" (frete gratis), so 15/09/2026 ate 23:59.
// Tem prioridade visual sobre o banner da Promocao das Cores enquanto
// estiver na janela; depois volta sozinho para o banner normal, sem
// precisar de nenhuma acao manual a meia-noite.
const CUSTOMER_DAY_START = new Date(2026, 8, 15, 0, 0, 0);
const CUSTOMER_DAY_END = new Date(2026, 8, 15, 23, 59, 59);
export const CUSTOMER_DAY_BANNER = 'promo/dia-do-cliente-2026-09-15.png';

export const isCustomerDayActive = () => {
  const now = new Date();
  return now >= CUSTOMER_DAY_START && now <= CUSTOMER_DAY_END;
};
