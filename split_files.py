import os
import re

wiki_dir = "/Volumes/Proyectos/Escrituras/wiki/propiedades"
files_to_split = [
    "Colonia Popular - Chacra 95 (Mza 46, Parc 4 y 5).md",
    "Machagai - Ruta 16 - Chacra 30.md"
]

for filename in files_to_split:
    filepath = os.path.join(wiki_dir, filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, "r") as f:
        content = f.read()
        
    # Extract references section
    refs = ""
    if "## 📑 Referencias" in content:
        parts = content.split("## 📑 Referencias")
        content = parts[0]
        refs = "\n## 📑 Referencias" + parts[1]
    elif "## Documentación" in content:
        parts = content.split("## Documentación")
        content = parts[0]
        refs = "\n## Documentación" + parts[1]
        
    # Remove hanging tags at the end of content before splitting
    content = re.sub(r'#propiedad.*?\n', '', content)
    
    # Split by YAML block start '---'
    # We will split using a regex that looks for '---' at the start of a line
    # Since the file might start with '\n---', we strip it first.
    chunks = re.split(r'\n---(?=\n)', '\n' + content.strip())
    
    # The split might create an empty first element. We iterate through chunks.
    # We reconstruct the blocks: each block must start with '---'
    blocks = []
    current_block = ""
    for chunk in chunks:
        if not chunk.strip(): continue
        if chunk.startswith("tipo: inmueble") or chunk.startswith("\ntipo: inmueble"):
            if current_block:
                blocks.append(current_block)
            current_block = "---\n" + chunk.strip()
        else:
            if current_block:
                current_block += "\n" + chunk.strip()
            else:
                # First chunk might be just '---', ignore
                pass
    if current_block:
        blocks.append(current_block)

    for block in blocks:
        # Extract title for the new filename
        title_match = re.search(r'#\s*(.+?)\n', block)
        if title_match:
            # Clean title
            title = title_match.group(1).replace('([[Hugo Daniel Rennis]])', '').replace('([[Judith Esther Núñez]])', '').strip()
            # Remove parenthesis at end if any
            title = re.sub(r'\s*\(.*?\)$', '', title)
            
            # Form base name
            if "Colonia Popular" in filename:
                new_filename = f"Colonia Popular - Chacra 95 - {title}.md"
                tags = "\n#propiedad #colonia-popular\n"
            else:
                new_filename = f"Machagai - Ruta 16 - Chacra 30 - {title}.md"
                tags = "\n#propiedad #machagai\n"
            
            new_filepath = os.path.join(wiki_dir, new_filename)
            
            # Combine block + tags + refs
            final_content = block.strip() + "\n" + tags + refs
            
            with open(new_filepath, "w") as f:
                f.write(final_content)
            print(f"Created {new_filename}")
            
    # Delete original file
    os.remove(filepath)
    print(f"Deleted original {filename}")

