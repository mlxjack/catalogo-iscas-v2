// Linha Aji: iscas de Ajing (finesse, ataques curtos, alta precisao).
// Um produto entra na linha se tiver "Aji" no nome/tag OU se o menor
// tamanho disponivel for ate 5cm -- mesmo sem "Aji" no nome, iscas
// pequenas seguem a mesma filosofia de uso e entram na linha.

export const parseSizeCm = (sizeStr) => {
  const m = String(sizeStr).match(/(\d+(?:[.,]\d+)?)/);
  return m ? parseFloat(m[1].replace(',', '.')) : null;
};

// Um valor de Tamanho individual (ex.: "4,5cm") e considerado Ajing
// quando o numero extraido e menor ou igual a 5.
export const isAjingSize = (sizeStr) => {
  const n = parseSizeCm(sizeStr);
  return n !== null && n <= 5;
};

export const isLinhaAji = (product) => {
  if (!product) return false;

  const tags = (product.tags || []).map((t) => t.toLowerCase());
  const hasAjiTag = tags.some((t) => t.includes('aji'));

  const nameHasAji =
    (product.title || '').toLowerCase().includes('aji') ||
    (product.id || '').toLowerCase().includes('aji');

  const sizes = (product.options && product.options['Tamanho']) || [];
  const nums = sizes.map(parseSizeCm).filter((n) => n !== null);
  const minSize = nums.length ? Math.min(...nums) : null;
  const sizeQualifies = minSize !== null && minSize <= 5;

  return hasAjiTag || nameHasAji || sizeQualifies;
};

export const getLinhaAjiProducts = (products) => (products || []).filter(isLinhaAji);
