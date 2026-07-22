import os, json, unicodedata, re

base = r'C:\Users\junir\.gemini\antigravity\scratch\chumbada-catalogo-iscas\public\iscas_cores'
manifest = {}

for handle in os.listdir(base):
    hp = os.path.join(base, handle)
    if os.path.isdir(hp):
        manifest[handle] = {}
        for fname in os.listdir(hp):
            if fname.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                key = fname.rsplit('.', 1)[0].lower()
                key_norm = unicodedata.normalize('NFD', key).encode('ascii', 'ignore').decode('utf-8')
                key_norm = re.sub(r'[^a-z0-9]', '', key_norm)
                manifest[handle][key_norm] = f'iscas_cores/{handle}/{fname}'

js_code = f"""// Auto-generated lure color images manifest
export const lureColorManifest = {json.dumps(manifest, indent=2)};

export const getLureColorImage = (handle, colorName) => {{
  if (!handle || !colorName || !lureColorManifest[handle]) return null;
  
  const normColor = colorName.toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
    
  const handleMap = lureColorManifest[handle];
  
  // Exact match
  if (handleMap[normColor]) {{
    return `${{import.meta.env.BASE_URL}}${{handleMap[normColor]}}`;
  }}
  
  // Partial / Fuzzy match
  for (const [key, path] of Object.entries(handleMap)) {{
    if (key.includes(normColor) || normColor.includes(key)) {{
      return `${{import.meta.env.BASE_URL}}${{path}}`;
    }}
  }}
  
  return null;
}};
"""

out_path = r'C:\Users\junir\.gemini\antigravity\scratch\chumbada-catalogo-iscas\src\utils\lureColorImages.js'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(js_code)

print('Generated lureColorImages.js with handles:', list(manifest.keys()))
