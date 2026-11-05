// SKUs com pendencia de cadastro na loja (conferido em 03/11/2026 contra o export da Shopify).
// Ao adicionar um destes na Minha Selecao/lista, o item recebe a observacao "conferir SKU".
// Quando a loja for corrigida e o products.csv atualizado, remover a linha correspondente.
export const SKU_ALERTS = {
  // Beijo da Sombra do Snaketail, Aji Nagare e Linguado: a cor existe (confirmado em 05/11/2026),
  // SKUs vindos da planilha antiga da loja, mas a variação não está cadastrada no export atual.
  "IS2703050006": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS2703050020": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS2703050100": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS2703075004": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS2703075020": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS2703075100": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS2703100003": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS2703100020": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS2703100100": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS4903045006": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS4903045020": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS4903045100": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS5115080020": "SKU repetido em cores diferentes na loja",
  "IS5615080020": "SKU repetido em cores diferentes na loja",
  "IS7103080004": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "IS7103110002": "Beijo da Sombra não cadastrado na loja (SKU da planilha antiga)",
  "PA10511": "produto ausente do export da loja",
  "PA10512": "produto ausente do export da loja",
  "PA10513": "produto ausente do export da loja",
  "PA10857": "sem equivalente no export da loja (cor/variação mudou ou saiu)",
};

export const SKU_NOTE = '⚠ Conferir SKU';

// Observacao para a lista: SKU ausente (cor sem variacao real) ou SKU com pendencia.
export const getSkuNote = (sku) => (!sku || SKU_ALERTS[sku] ? SKU_NOTE : "");
