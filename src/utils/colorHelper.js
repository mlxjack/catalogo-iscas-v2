// List of available color images - exact filenames in public/cores/
export const colorFiles = [
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

export const normalizeString = (str) =>
  str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

export const getColorImage = (colorName) => {
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
