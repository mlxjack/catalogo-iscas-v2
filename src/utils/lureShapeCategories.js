// Categorias por formato/tipo de isca, curadas manualmente por modelo real
// do catalogo (o campo "Type" do CSV Shopify vem sempre vazio, entao nao da
// pra derivar categoria automaticamente a partir dele).

export const LURE_SHAPE_CATEGORIES = [
  { key: 'paddles-shads', label: 'Paddles e Shads' },
  { key: 'grubs-curly-tails', label: 'Grubs e Curly Tails' },
  { key: 'worms-minhocas-larvas', label: 'Worms, Minhocas e Larvas' },
  { key: 'camaroes-crustaceos', label: 'Camarões e Crustáceos' },
  { key: 'sapos-girinos', label: 'Sapos e Girinos' },
  { key: 'criaturas-insetos-animais', label: 'Criaturas, Insetos e Animais' },
  { key: 'flukes-imitacoes-peixe', label: 'Flukes e Imitações de Peixe' },
  { key: 'finesse-formatos-especiais', label: 'Finesse e Formatos Especiais' },
];

// Handle (CSV) -> chave da categoria. Mapeado a mao contra os 68 handles
// reais do catalogo (varios titulos nao batem com o handle por causa de
// renomeacoes antigas na Shopify, entao o match e por handle, nao por nome).
const HANDLE_CATEGORY = {
  // 1. Paddles e Shads
  'isca-artificial-shad-gaikotsu': 'paddles-shads',
  'kit-isca-artificial-ajikoka': 'paddles-shads',
  'kit-isca-artificial-mini-paddle': 'paddles-shads',
  'isca-artificial-serelepe': 'paddles-shads',
  'isca-artificial-shad-padoru': 'paddles-shads',
  'isca-artificial-tatsumaki': 'paddles-shads',
  'isca-artificial-boom-paddle': 'paddles-shads',

  // 2. Grubs e Curly Tails
  'isca-artificial-ajigrub': 'grubs-curly-tails',
  'kit-isca-artificial-mustache-grub': 'grubs-curly-tails',
  'isca-artificial-grub': 'grubs-curly-tails',
  'kit-isca-artificial-wave-grub': 'grubs-curly-tails',
  'kit-isca-artificial-double-grub': 'grubs-curly-tails',
  'isca-artificial-danca-dagua': 'grubs-curly-tails',

  // 3. Worms, Minhocas e Larvas
  'isca-artificial-ajimimizu': 'worms-minhocas-larvas',
  'kit-isca-artificial-ajimushi': 'worms-minhocas-larvas',
  'kit-isca-artificial-ajiaero': 'worms-minhocas-larvas',
  'kit-isca-artificial-ajikaze': 'worms-minhocas-larvas',
  'kit-isca-artificial-snaketail': 'worms-minhocas-larvas',
  'kit-isca-artificial-ajineedle': 'worms-minhocas-larvas',
  'kit-isca-artificial-tornado-worm': 'worms-minhocas-larvas',
  'kit-isca-artificial-lacraworm-copia': 'worms-minhocas-larvas',
  'kit-isca-artificial-vibraworm': 'worms-minhocas-larvas',
  'kit-isca-artificial-tipworm': 'worms-minhocas-larvas',
  'kit-isca-artificial-fatworm': 'worms-minhocas-larvas',
  'kit-isca-artificial-filotail': 'worms-minhocas-larvas',

  // 4. Camarões e Crustáceos
  'isca-artificial-camarao-chiclete': 'camaroes-crustaceos',
  'kit-isca-artificial-ajishirimp': 'camaroes-crustaceos',
  'kit-isca-artificial-claw-strike': 'camaroes-crustaceos',
  'kit-isca-artificial-morceguinho': 'camaroes-crustaceos',
  'isca-artificial-camarao-offset-articulado': 'camaroes-crustaceos',
  'isca-artificial-camarao-jig-head-articulado': 'camaroes-crustaceos',
  // "Camarão Articulado" (handle legado, pré-padronização) entra na mesma
  // categoria do Camarão Jig Head Articulado, sem virar um modelo à parte.
  'isca-artificial-camarao-articulado': 'camaroes-crustaceos',
  'kit-isca-artificial-lagostim': 'camaroes-crustaceos',
  'kit-isca-artificial-garra-brava': 'camaroes-crustaceos',
  'isca-artificial-pitu': 'camaroes-crustaceos',

  // 5. Sapos e Girinos
  'kit-isca-artificial-aji-fukura': 'sapos-girinos',
  'kit-isca-artificial-legfrog': 'sapos-girinos',
  'isca-artificial-sapo-estica': 'sapos-girinos',
  'isca-artificial-sapinho-costela': 'sapos-girinos',

  // 6. Criaturas, Insetos e Animais
  'kit-isca-artificial-ajiegg': 'criaturas-insetos-animais',
  'kit-isca-artificial-ajimizu': 'criaturas-insetos-animais',
  'kit-isca-artificial-ajibeast': 'criaturas-insetos-animais',
  'kit-isca-artificial-lesma': 'criaturas-insetos-animais',
  'kit-isca-artificial-lagartixa': 'criaturas-insetos-animais',
  'kit-isca-artificial-grilo': 'criaturas-insetos-animais',
  'kit-isca-artificial-folha': 'criaturas-insetos-animais',
  'kit-isca-artificial-lagartail': 'criaturas-insetos-animais',
  'isca-artificial-bait-boss': 'criaturas-insetos-animais',
  'isca-artificial-viperbug': 'criaturas-insetos-animais',
  'isca-artificial-batelouca': 'criaturas-insetos-animais',

  // 7. Flukes e Imitações de Peixe
  'kit-isca-artificial-fatfish': 'flukes-imitacoes-peixe',
  'kit-isca-artificial-belly-fluke': 'flukes-imitacoes-peixe',
  'kit-isca-artificial-gfluke': 'flukes-imitacoes-peixe',

  // 8. Finesse e Formatos Especiais
  'kit-isca-artificial-ajihane': 'finesse-formatos-especiais',
  'kit-isca-artificial-aji-nagare': 'finesse-formatos-especiais',
  'kit-isca-artificial-ajisho': 'finesse-formatos-especiais',
  'kit-isca-artificial-ajiring': 'finesse-formatos-especiais',
  // Handle antigo diz "ajineedle-1" mas o produto foi renomeado p/ AjiBall.
  'kit-isca-artificial-ajineedle-1': 'finesse-formatos-especiais',
  'kit-isca-artificial-ajistingv': 'finesse-formatos-especiais',
  'kit-isca-artificial-ajitwin': 'finesse-formatos-especiais',
  'kit-isca-artificial-lighthane': 'finesse-formatos-especiais',
  'kit-isca-artificial-easy-drift': 'finesse-formatos-especiais',
  'isca-artificial-linguado': 'finesse-formatos-especiais',
  'isca-artificial-bubble-tube': 'finesse-formatos-especiais',
  'kit-isca-artificial-pepino-do-mar': 'finesse-formatos-especiais',
};

const LABEL_BY_KEY = Object.fromEntries(LURE_SHAPE_CATEGORIES.map((c) => [c.key, c.label]));

export const getLureShapeCategoryKey = (product) => HANDLE_CATEGORY[product?.id] || null;

export const getLureShapeCategoryLabel = (product) => {
  const key = getLureShapeCategoryKey(product);
  return key ? LABEL_BY_KEY[key] : null;
};
