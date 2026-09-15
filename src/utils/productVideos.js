// Videos de produto hospedados localmente (independentes da Shopify),
// mesmo padrao do lureColorManifest: handle -> caminho relativo em public/.
export const productVideoManifest = {
  'isca-artificial-bubble-tube': 'videos/isca-artificial-bubble-tube.mp4',
};

export const getProductVideo = (handle) => {
  if (!handle || !productVideoManifest[handle]) return null;
  return `${import.meta.env.BASE_URL}${productVideoManifest[handle]}`;
};
