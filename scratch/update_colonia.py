import os
import sys

files = [
    "Colonia Popular - Chacra 95 - Parcela 04, Manzana 46.md",
    "Colonia Popular - Chacra 95 - Parcela 05, Manzana 46.md",
    "Colonia Popular - Chacra 95 - Parcela 06, Manzana 45.md",
    "Colonia Popular - Chacra 95 - Parcela 07, Manzana 45.md"
]

base_path = "/Volumes/Proyectos/Escrituras/wiki/propiedades/"
image_path = "attachments/propiedades/Colonia Popular - Chacra 95/portada.png"

history = """
## Historial de Procesamiento
- **2026-05-02**: Se establece la imagen satelital como portada oficial (`portada.png`).
- **Estado**: Metadatos legales cargados.
"""

for f in files:
    full_path = os.path.join(base_path, f)
    if os.path.exists(full_path):
        with open(full_path, 'r') as file:
            content = file.read()
        
        # Add foto_portada
        if 'foto_portada:' not in content:
            content = content.replace('ultima_actualizacion:', f'foto_portada: "{image_path}"\nultima_actualizacion:')
        
        # Add history if not exists
        if '## Historial de Procesamiento' not in content:
            content = content.strip() + "\n" + history
            
        with open(full_path, 'w') as file:
            file.write(content)
        print(f"Updated {f}")
    else:
        print(f"File not found: {f}")
