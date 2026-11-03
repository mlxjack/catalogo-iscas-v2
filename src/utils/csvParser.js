import Papa from 'papaparse';

export const loadProducts = async () => {
  return new Promise((resolve, reject) => {
    const csvPath = `${import.meta.env.BASE_URL}products.csv`;
    Papa.parse(csvPath, {
      download: true,
      header: true,
      complete: (results) => {
        const rawData = results.data;
        const productsMap = new Map();

        rawData.forEach(row => {
          if (!row.Handle) return; // Skip empty rows

          // If product doesn't exist yet, create it
          if (!productsMap.has(row.Handle)) {
            productsMap.set(row.Handle, {
              id: row.Handle,
              title: row.Title,
              description: row['Body (HTML)'],
              vendor: row.Vendor,
              category: row['Product Category'],
              type: row.Type,
              tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
              variants: [],
              images: new Set(),
              optionNames: [row['Option1 Name'], row['Option2 Name'], row['Option3 Name']],
              options: {
                [row['Option1 Name']]: new Set(),
                [row['Option2 Name']]: new Set(),
                [row['Option3 Name']]: new Set(),
              }
            });
          }

          const product = productsMap.get(row.Handle);
          
          // Add Variant
          const variant = {
            sku: row['Variant SKU'],
            price: parseFloat(row['Variant Price']) || 0,
            grams: parseFloat(row['Variant Grams']) || 0,
            image: row['Variant Image'] || row['Image Src'],
            option1: row['Option1 Value'],
            option2: row['Option2 Value'],
            option3: row['Option3 Value'],
          };
          product.variants.push(variant);

          // Add unique options using tracked optionNames
          const optNames = product.optionNames;
          if (optNames[0] && row['Option1 Value']) product.options[optNames[0]].add(row['Option1 Value']);
          if (optNames[1] && row['Option2 Value']) product.options[optNames[1]].add(row['Option2 Value']);
          if (optNames[2] && row['Option3 Value']) product.options[optNames[2]].add(row['Option3 Value']);

          // Add Images
          if (row['Image Src']) {
            product.images.add(row['Image Src']);
          }
          if (row['Variant Image']) {
            product.images.add(row['Variant Image']);
          }
        });

        // Clean up Maps and Sets to Arrays
        const products = Array.from(productsMap.values()).map(p => {
          const cleanOptions = {};
          Object.keys(p.options).forEach(key => {
            if (key && key !== 'undefined') {
              const values = Array.from(p.options[key]).filter(v => v);
              if (values.length > 0) {
                cleanOptions[key] = values;
              }
            }
          });

          // Cores: somente as que existem como variacao no CSV (nenhuma cor "inventada").
          // A ordem segue a paleta padrao da marca; cores fora dela vao depois, na ordem do CSV.
          const COLOR_ORDER = ['brancoperola', 'glow', 'rapadura', 'roxoestelar', 'roxoestrelar',
            'vermelhoholografico', 'veudanoite', 'amareloneon', 'laranjaneon', 'pretobrilhante',
            'capimrubi', 'verdeneon', 'pastel', 'cha', 'chapastel'];
          const colorRank = (c) => {
            const i = COLOR_ORDER.indexOf(c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, ''));
            return i === -1 ? COLOR_ORDER.length : i;
          };
          if (cleanOptions['Cor']) {
            cleanOptions['Cor'] = cleanOptions['Cor']
              .map((c, idx) => [c, idx])
              .sort((a, b) => colorRank(a[0]) - colorRank(b[0]) || a[1] - b[1])
              .map(([c]) => c);
          }

          // Sort images to have a consistent main image
          const imagesArr = Array.from(p.images).filter(i => i);
          
          // Try to set a good main image if missing
          if (imagesArr.length === 0 && p.variants.length > 0) {
             const firstWithImage = p.variants.find(v => v.image);
             if (firstWithImage) imagesArr.push(firstWithImage.image);
          }

          return {
            ...p,
            options: cleanOptions,
            images: imagesArr,
            minPrice: Math.min(...p.variants.filter(v => v.price > 0).map(v => v.price)),
            maxPrice: Math.max(...p.variants.filter(v => v.price > 0).map(v => v.price)),
          };
        });

        resolve(products);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
