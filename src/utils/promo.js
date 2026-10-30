// Promocao das Cores de OUTUBRO/2026: 12% OFF nas cores Laranja Neon,
// Verde Neon, Capim Rubi e Preto Brilhante, durante todo o mes de outubro.
// (A edicao anterior -- Preto Brilhante, Amarelo Neon, Glow e Branco Perola,
// 24/08 a 30/09 -- ja encerrou.) Ativa/desativa sozinha com base na data
// local do visitante -- nao precisa de nenhuma acao manual no dia em que
// comeca ou termina.

import { BLACK_NOVEMBER_30 } from './blackNovember30';

const PROMO_START = new Date(2026, 9, 1, 0, 0, 0);    // 1 de outubro de 2026, 00:00
const PROMO_END = new Date(2026, 9, 31, 23, 59, 59);  // 31 de outubro de 2026, 23:59
const PROMO_DISCOUNT = 0.12; // 12%

const PROMO_COLORS = ['Laranja Neon', 'Verde Neon', 'Capim Rubi', 'Preto Brilhante'];

const normalize = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const PROMO_COLORS_NORM = new Set(PROMO_COLORS.map(normalize));

// ---- Black November 2026 (01/11 a 30/11) ----
// A janela de datas vive em public/black-november/bn.js, que tambem expoe
// window.BLACK_NOVEMBER_ACTIVE (tema preto + carrossel de banners). Aqui so
// consumimos essa flag, entao existe uma unica fonte da verdade para a data.
//  - 30% OFF: pares isca+cor fora de padrao/inativas (planilha de estoque)
//  - 12% OFF: Vermelho Holografico, Veu da Noite, Pastel e Preto Brilhante
// Se o mesmo par estiver nas duas regras, vale o de 30% (par listado no estoque).
const BN_DISCOUNT_STOCK = 0.3;
const BN_DISCOUNT_COLORS = 0.12;
const BN_COLORS_12 = ['Vermelho Holográfico', 'Véu da Noite', 'Pastel', 'Preto Brilhante'];
const BN_COLORS_12_NORM = new Set(BN_COLORS_12.map(normalize));
const BN_30_NORM = Object.fromEntries(
  Object.entries(BLACK_NOVEMBER_30).map(([h, cs]) => [h, new Set(cs.map(normalize))])
);
// As 13 cores padrao exibidas no seletor (ver csvParser.js). As demais cores da lista de 30%
// sao 'fora de padrao' e aparecem num bloco proprio na pagina do produto.
const STANDARD_COLORS_NORM = new Set(
  ['Branco Perola', 'Glow', 'Rapadura', 'Roxo Estrelar', 'Vermelho Holográfico', 'Véu Da Noite', 'Amarelo Neon',
    'Laranja Neon', 'Preto Brilhante', 'Capim Rubi', 'Verde Neon', 'Pastel', 'Chá'].map(normalize)
);

export const isBlackNovemberActive = () =>
  typeof window !== 'undefined' && window.BLACK_NOVEMBER_ACTIVE === true;

export const isPromoActive = () => {
  if (isBlackNovemberActive()) return true;
  const now = new Date();
  return now >= PROMO_START && now <= PROMO_END;
};

// Fracao de desconto (0, 0.12 ou 0.3) para a cor de um produto, na promocao vigente.
export const getColorDiscount = (colorName, productId) => {
  const n = normalize(colorName);
  if (isBlackNovemberActive()) {
    if (productId && BN_30_NORM[productId] && BN_30_NORM[productId].has(n)) return BN_DISCOUNT_STOCK;
    return BN_COLORS_12_NORM.has(n) ? BN_DISCOUNT_COLORS : 0;
  }
  const now = new Date();
  if (now >= PROMO_START && now <= PROMO_END && PROMO_COLORS_NORM.has(n)) return PROMO_DISCOUNT;
  return 0;
};

export const isPromoColor = (colorName, productId) => getColorDiscount(colorName, productId) > 0;

export const getPromoPrice = (price, discount = PROMO_DISCOUNT) => Math.round(price * (1 - discount) * 100) / 100;

export const discountPct = (fraction) => Math.round(fraction * 100);

// Maior desconto que o produto tem em alguma cor (para o selo do card), 0 se nenhum.
export const getProductMaxDiscount = (productId, colors = []) => {
  if (!isPromoActive()) return 0;
  let best = 0;
  colors.forEach((c) => { best = Math.max(best, getColorDiscount(c, productId)); });
  if (isBlackNovemberActive() && BN_30_NORM[productId]) best = Math.max(best, BN_DISCOUNT_STOCK);
  return best;
};

// Cores fora de padrao (30% OFF) do produto, que nao existem no seletor de 13 cores.
export const getOffPatternColors = (productId) =>
  !isBlackNovemberActive() || !BLACK_NOVEMBER_30[productId]
    ? []
    : BLACK_NOVEMBER_30[productId].filter((c) => !STANDARD_COLORS_NORM.has(normalize(c)));

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
