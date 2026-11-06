// SKUs com pendencia de cadastro na loja (conferido em 03/11/2026 contra o export da Shopify).
// Ao adicionar um destes na Minha Selecao/lista, o item recebe a observacao "conferir SKU".
// Quando a loja for corrigida e o products.csv atualizado, remover a linha correspondente.
export const SKU_ALERTS = {
  "IS2703050006": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS2703050020": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS2703050100": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS2703075004": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS2703075020": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS2703075100": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS2703100003": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS2703100020": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS2703100100": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS7103080004": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS7103110002": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
  "IS1531080100": "SKU repetido em cores diferentes na loja",
  "IS1531100100": "SKU repetido em cores diferentes na loja",
  "PA10511": "produto ausente do export da loja",
  "PA10512": "produto ausente do export da loja",
  "PA10513": "produto ausente do export da loja",
};

export const SKU_NOTE = '⚠ Conferir SKU';

// Observacao para a lista: SKU ausente (cor sem variacao real) ou SKU com pendencia.
export const getSkuNote = (sku) => (!sku || SKU_ALERTS[sku] ? SKU_NOTE : "");
