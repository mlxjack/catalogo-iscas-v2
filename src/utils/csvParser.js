import Papa from 'papaparse';

export const loadProducts = async () => {
  return new Promise((resolve, reject) => {
    Papa.parse('/products.csv', {
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

          // Add unique options
          if (row['Option1 Name'] && row['Option1 Value']) product.options[row['Option1 Name']].add(row['Option1 Value']);
          if (row['Option2 Name'] && row['Option2 Value']) product.options[row['Option2 Name']].add(row['Option2 Value']);
          if (row['Option3 Name'] && row['Option3 Value']) product.options[row['Option3 Name']].add(row['Option3 Value']);

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
