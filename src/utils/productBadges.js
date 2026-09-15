// Etiquetas extras por produto (ex.: "Acompanha um Rattling").
// handle -> array de textos. Um produto pode ter mais de uma etiqueta.
export const productBadgeManifest = {
  'isca-artificial-bubble-tube': ['Acompanha um Rattling'],
};

export const getProductBadges = (handle) => productBadgeManifest[handle] || [];
