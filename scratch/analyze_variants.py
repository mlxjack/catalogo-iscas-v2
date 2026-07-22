import csv

csv_path = 'public/products.csv'
products = {}

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        h = row.get('Handle', '').strip()
        if not h: continue
        
        o1n = row.get('Option1 Name', '').strip()
        o2n = row.get('Option2 Name', '').strip()
        o3n = row.get('Option3 Name', '').strip()
        o1v = row.get('Option1 Value', '').strip()
        o2v = row.get('Option2 Value', '').strip()
        o3v = row.get('Option3 Value', '').strip()
        price = row.get('Variant Price', '').strip()
        
        if h not in products:
            products[h] = {
                'title': row.get('Title', h),
                'opt_names': [o1n, o2n, o3n],
                'combinations': set()
            }
        
        products[h]['combinations'].add((o1v, o2v, o3v))

# Find products with gaps in variant combinations
print('Products with INCOMPLETE variant matrix (not all option combos exist):')
print('=' * 100)
for h, p in sorted(products.items()):
    opts = [n for n in p['opt_names'] if n]
    combos = p['combinations']
    
    if len(opts) < 2:
        continue
    
    unique_o1 = sorted(set(c[0] for c in combos))
    unique_o2 = sorted(set(c[1] for c in combos if c[1]))
    
    if not unique_o2:
        continue
    
    # Check if all o1 x o2 combos exist
    missing = []
    for v1 in unique_o1:
        for v2 in unique_o2:
            found = any(c[0] == v1 and c[1] == v2 for c in combos)
            if not found:
                missing.append((v1, v2))
    
    if missing:
        print(f'\n{p["title"]} ({h})')
        print(f'  Option1 ({p["opt_names"][0]}): {unique_o1}')
        print(f'  Option2 ({p["opt_names"][1]}): {unique_o2}')
        print(f'  Missing combinations ({len(missing)}): {missing[:10]}')
        if len(missing) > 10:
            print(f'  ... and {len(missing)-10} more')
