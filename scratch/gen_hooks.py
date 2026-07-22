import openpyxl, json, re, unicodedata

def norm(text):
    if not text: return ''
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = text.lower().replace('blubble', 'bubble').replace('latostim', 'lagostim').replace('caramao', 'camarao').replace('padlle', 'paddle')
    return re.sub(r'[^a-z0-9]', '', text)

file_path = r'C:\Users\junir\Downloads\Telegram Desktop\Iscas (2).xlsx'
wb = openpyxl.load_workbook(file_path)
ws = wb['Planilha1']

excel_data = {}

for row in ws.iter_rows(values_only=True):
    name_size = row[0]
    hook = row[1]
    if not name_size or not hook or str(name_size).strip() == 'Isca e tamanho':
        continue
    
    name_size_str = str(name_size).strip()
    hook_str = str(hook).strip()
    
    m = re.search(r'^(.*?)\s+([\d.,]+\s*(?:cm|mm)?)$', name_size_str, re.IGNORECASE)
    if m:
        lure_name = m.group(1).strip()
        size_str = m.group(2).strip()
    else:
        lure_name = name_size_str
        size_str = ''
        
    lure_key = norm(lure_name)
    if not lure_key: continue
    
    if lure_key not in excel_data:
        excel_data[lure_key] = {'name': lure_name, 'sizes': {}, 'default': hook_str}
        
    if size_str:
        size_clean = re.sub(r'[^0-9.,]', '', size_str).strip()
        excel_data[lure_key]['sizes'][size_clean] = hook_str
        if '.' in size_clean:
            excel_data[lure_key]['sizes'][size_clean.replace('.', ',')] = hook_str
        elif ',' in size_clean:
            excel_data[lure_key]['sizes'][size_clean.replace(',', '.')] = hook_str

# Add manual alias keys for handles if needed
alias_map = {
    'jigheaddeolho': 'jighead',
    'jigheaddeolho90': 'jighead',
    'anteninhaatomo11mm2unidades': 'anteninha',
    'camaraoarticulado': 'camarao',
    'camaraojigheadarticulado': 'camaraojigheadarticulado',
    'camaraooffsetarticulado': 'camaraooffsetarticulado'
}

for alias, target in alias_map.items():
    if target in excel_data:
        excel_data[alias] = excel_data[target]

js_code = f"""// Auto-generated hook recommendations from Iscas (2).xlsx
export const HOOK_DATABASE = {json.dumps(excel_data, indent=2)};

export const getRecommendedHookForLure = (title, size) => {{
  if (!title) return null;

  const titleNorm = title.toLowerCase()
    .normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

  let matchedKey = null;
  // Match longer keys first
  const keys = Object.keys(HOOK_DATABASE).sort((a, b) => b.length - a.length);
  for (const key of keys) {{
    if (titleNorm.includes(key) || key.includes(titleNorm)) {{
      matchedKey = key;
      break;
    }}
  }}

  if (!matchedKey) return null;

  const data = HOOK_DATABASE[matchedKey];
  
  if (size && data.sizes && Object.keys(data.sizes).length > 0) {{
    const cleanSize = String(size).toLowerCase().replace('cm', '').replace('mm', '').trim();
    
    if (data.sizes[cleanSize]) {{
      return data.sizes[cleanSize];
    }}

    const numMatch = cleanSize.match(/\\d+([.,]\\d+)?/);
    if (numMatch) {{
      const numStr = numMatch[0];
      if (data.sizes[numStr]) {{
        return data.sizes[numStr];
      }}
      const intNum = numStr.split(/[.,]/)[0];
      if (data.sizes[intNum]) {{
        return data.sizes[intNum];
      }}
    }}
  }}

  return data.default || null;
}};
"""

out_path = r'C:\Users\junir\.gemini\antigravity\scratch\chumbada-catalogo-iscas\src\utils\hookRecommendations.js'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f'Generated hookRecommendations.js with {len(excel_data)} lure keys!')
