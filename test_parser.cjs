const fs = require('fs');
const Papa = require('papaparse');

const csvContent = fs.readFileSync('./public/products.csv', 'utf8');

Papa.parse(csvContent, {
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
          optionNames: [row['Option1 Name'], row['Option2 Name'], row['Option3 Name']],
          options: {
            [row['Option1 Name']]: new Set(),
            [row['Option2 Name']]: new Set(),
            [row['Option3 Name']]: new Set(),
          },
          variantsCount: 0
        });
      }

      const product = productsMap.get(row.Handle);
      product.variantsCount++;
      
      const optNames = product.optionNames;
      if (optNames[0] && row['Option1 Value']) product.options[optNames[0]].add(row['Option1 Value']);
      if (optNames[1] && row['Option2 Value']) product.options[optNames[1]].add(row['Option2 Value']);
      if (optNames[2] && row['Option3 Value']) product.options[optNames[2]].add(row['Option3 Value']);
    });

    const slim = productsMap.get('iscas-soft-slim-camarao-unidade');
    if(slim) {
      console.log('SLIM options:', {
        opt1: Array.from(slim.options[slim.optionNames[0]] || []),
        opt2: Array.from(slim.options[slim.optionNames[1]] || []),
        opt3: Array.from(slim.options[slim.optionNames[2]] || []),
        totalVariants: slim.variantsCount
      });
    }

    const t = Array.from(productsMap.values())[0];
    console.log(t.id, t.variantsCount);
  }
});
