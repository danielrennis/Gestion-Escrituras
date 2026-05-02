import os

wiki_dir = "/Volumes/Proyectos/Escrituras/wiki/propiedades"
pairs = [
    ("Machagai - Alberdi.md", "Machagai - Alberdi (IA).md"),
    ("Machagai - Carlitos.md", "Machagai - Carlitos (IA).md"),
    ("Machagai - Donacion Angel la Gata.md", "Machagai - Donacion Angel la Gata (IA).md"),
    ("Machagai - Donacion Benchu.md", "Machagai - Donacion Benchu (IA).md"),
    ("Machagai - Encina.md", "Machagai - Encina (IA).md"),
    ("Machagai - Farmacia.md", "Machagai - Farmacia (IA).md"),
    ("Resistencia - Domicilio.md", "Resistencia - Domicilio (IA).md"),
    ("Machagai - Ruta 16 - Chacra 30.md", "Machagai - Ruta 16 - Chacra 30 (IA).md")
]

for old_name, ia_name in pairs:
    old_path = os.path.join(wiki_dir, old_name)
    ia_path = os.path.join(wiki_dir, ia_name)
    
    if os.path.exists(old_path) and os.path.exists(ia_path):
        # Read old content to find links
        with open(old_path, "r") as f:
            old_content = f.read()
            
        # Extract links section
        links_section = ""
        if "## Documentación Adjunta" in old_content:
            links_section = "## Documentación Adjunta\n" + old_content.split("## Documentación Adjunta")[1].strip()
        elif "## 📑 Referencias" in old_content:
            links_section = "## 📑 Referencias\n" + old_content.split("## 📑 Referencias")[1].strip()
            
        # Read IA content
        with open(ia_path, "r") as f:
            ia_content = f.read()
            
        # Clean IA content (remove markdown backticks if any)
        ia_content = ia_content.replace('```yaml\n', '').replace('\n```', '')
        if "Aquí tienes el análisis" in ia_content:
            if "---" in ia_content:
                ia_content = "---" + ia_content.split("---", 1)[1]
                
        # Merge
        merged_content = ia_content + "\n\n" + links_section
        
        # Write to old path (unify under clean name)
        with open(old_path, "w") as f:
            f.write(merged_content)
            
        # Delete IA file
        os.remove(ia_path)
        print(f"Merged and cleaned: {old_name}")

# Restore Colonia Popular links
colonia_path = os.path.join(wiki_dir, "Colonia Popular - Chacra 95 (Mza 46, Parc 4 y 5).md")
if os.path.exists(colonia_path):
    with open(colonia_path, "r") as f:
        col_content = f.read()
    if "## 📑 Referencias" not in col_content:
        links = """
## 📑 Referencias (Archivos Organizados)
- [[attachments/propiedades/Colonia Popular/IMG_7141.jpg|Plano de Mensura]]
- [[attachments/propiedades/Colonia Popular/IMG_7142.jpg|Escritura Pág 1]]
- [[attachments/propiedades/Colonia Popular/IMG_7143.jpg|Escritura Pág 2]]
- [[attachments/propiedades/Colonia Popular/IMG_7144.jpg|Escritura Pág 3 (Descripción Parcelas)]]
- [[attachments/propiedades/Colonia Popular/IMG_7145.jpg|Escritura Pág 4 (Precio y Aceptación)]]
"""
        with open(colonia_path, "a") as f:
            f.write(links)
        print("Restored Colonia Popular links.")
