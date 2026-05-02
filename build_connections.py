import os
import re

wiki_dir = "/Volumes/Proyectos/Escrituras/wiki/propiedades"
entidades_dir = "/Volumes/Proyectos/Escrituras/wiki/entidades"
root_wiki = "/Volumes/Proyectos/Escrituras/wiki"

entidades = ["Hugo Daniel Rennis", "Judith Esther Núñez", "Radis Domingo Miguel", "Zelíg Riback", "Hugo Daniel RENNIS", "Judith Esther NUÑEZ", "Zelig RIBACK"]

# 1. Crear entidades básicas
entidades_crear = {
    "Hugo Daniel Rennis": "Titular principal de varias propiedades en Machagai y Colonia Popular.",
    "Judith Esther Núñez": "Titular de Unidad Funcional en La California y Parcela en Colonia Popular.",
    "Radis Domingo Miguel": "Antiguo titular de las parcelas de Chacra 30, Machagai (afectado por remate).",
    "Zelíg Riback": "Titular fiduciario anterior del Barrio Privado La California."
}

for ent, desc in entidades_crear.items():
    path = os.path.join(entidades_dir, f"{ent}.md")
    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write(f"---\ntipo: entidad\n---\n# {ent}\n\n{desc}\n\n## Propiedades Vinculadas\n```dataview\nLIST FROM \"wiki/propiedades\" WHERE contains(titulares, \"{ent}\") or contains(file.outlinks, [[{ent}]])\n```\n")

# 2. Generar conexiones en las propiedades
for filename in os.listdir(wiki_dir):
    if not filename.endswith(".md"): continue
    filepath = os.path.join(wiki_dir, filename)
    with open(filepath, "r") as f:
        content = f.read()

    # Determine tags
    tags = ["#propiedad"]
    if "machagai" in filename.lower(): tags.append("#machagai")
    elif "colonia" in filename.lower(): tags.append("#colonia-popular")
    elif "resistencia" in filename.lower() or "california" in filename.lower(): tags.append("#resistencia")
    
    # Check if tags already exist
    if "#propiedad" not in content:
        # Append tags before '## Documentación' or at end
        tags_str = "\n" + " ".join(tags) + "\n\n"
        if "## Documentación" in content:
            content = content.replace("## Documentación", tags_str + "## Documentación")
        elif "## 📑 Referencias" in content:
            content = content.replace("## 📑 Referencias", tags_str + "## 📑 Referencias")
        else:
            content += tags_str
            
    # Replace names with wikilinks in body (only if not already linked)
    for ent in entidades:
        # Avoid double linking: \[\[Hugo Daniel Rennis\]\]
        # We replace any exact match that is not preceded by [[
        # Using a simple regex with negative lookbehind
        pattern = r'(?<!\[\[)(' + re.escape(ent) + r')(?!\]\])'
        # For simplicity, if we map 'Hugo Daniel RENNIS' to 'Hugo Daniel Rennis'
        target_link = "Hugo Daniel Rennis" if "RENNIS" in ent else "Judith Esther Núñez" if "NUÑEZ" in ent else ent
        if "RIBACK" in ent: target_link = "Zelíg Riback"
        
        content = re.sub(pattern, f"[[{target_link}]]", content)

    with open(filepath, "w") as f:
        f.write(content)

# 3. Create Index (MoC)
index_path = os.path.join(root_wiki, "Índice General de Propiedades.md")
with open(index_path, "w") as f:
    f.write("""---
tipo: moc
---
# 🗺️ Índice General de Propiedades

Este es un panel de control automatizado (MoC) de todas las propiedades procesadas y registradas en el sistema.

## 📊 Propiedades por Estado Legal

```dataview
TABLE localidad, titulares, estado_legal, superficie
FROM "wiki/propiedades"
WHERE tipo = "inmueble" or tipo = "Lote"
SORT localidad ASC
```

## 👥 Red de Titulares

```dataview
TABLE length(rows) as Cantidad_Propiedades
FROM "wiki/propiedades"
FLATTEN titulares
GROUP BY titulares
```

## 📂 Enlaces Rápidos
- [[Hugo Daniel Rennis]]
- [[Judith Esther Núñez]]
""")
print("Conexiones y MOC generados.")
