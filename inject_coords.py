import os
import re

coords_data = {
    "Machagai - Alberdi": "-26.92678, -60.05086",
    "Machagai - Carlitos": "-26.92730, -60.04398",
    "Machagai - Farmacia": "-26.92871, -60.05328",
    "Machagai - Donacion Benchu": "-26.92444, -60.05607",
    "Machagai - Donacion Angel la Gata": "-26.92445, -60.05594",
    "Machagai - Encina": "-26.92903, -60.04465",
    "Machagai - Ruta 16 - Chacra 30": "-26.93578, -60.06527",
    "Colonia Popular - Chacra 95 (Mza 46, Parc 4 y 5)": "-27.26964, -59.15856",
    "Resistencia - Domicilio": "-27.46374, -59.01087",
    "La California - Lotes 287 y 288": "-27.41657, -58.95444"
}

wiki_dir = "/Volumes/Proyectos/Escrituras/wiki/propiedades"

for file in os.listdir(wiki_dir):
    if not file.endswith(".md"): continue
    
    # Matching exactly the file name without extension
    prop_name = file[:-3]
    if prop_name in coords_data:
        coords = coords_data[prop_name]
        filepath = os.path.join(wiki_dir, file)
        
        with open(filepath, "r") as f:
            content = f.read()
            
        # Add to all YAML blocks in the file
        # Find 'ultima_actualizacion:' and insert coords before it, only if coords doesn't exist
        
        if "coordenadas:" not in content:
            content = re.sub(r'(ultima_actualizacion:.*?)\n', f'coordenadas: "{coords}"\n\\1\n', content)
            
            with open(filepath, "w") as f:
                f.write(content)
            print(f"Injectado {coords} en {file}")

