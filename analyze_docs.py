import os
import sys
import time
import google.generativeai as genai

API_KEY = "AIzaSyC7fEnz4NHpmhKRRTn2LdjWV9LoZs0ejLo"
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

def analyze_folder(folder_path, output_name):
    print(f"Analizando: {folder_path}")
    image_files = []
    for root, dirs, files in os.walk(folder_path):
        for f in files:
            if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_files.append(os.path.join(root, f))
    
    if not image_files:
        print(f"No hay imágenes en {folder_path}")
        return

    print(f"Subiendo {len(image_files)} imágenes...")
    uploaded_files = []
    for img_path in sorted(image_files):
        try:
            f = genai.upload_file(img_path)
            uploaded_files.append(f)
            time.sleep(2)
        except Exception as e:
            print(f"Error subiendo {img_path}: {e}")
    
    prompt = """
Sos un experto legal y catastral. Estás analizando toda la documentación de un conjunto de propiedades o terrenos (escrituras, planos, certificados).
Tu objetivo es identificar TODOS los datos de cada propiedad que aparezca en estas imágenes. Si hay múltiples terrenos o parcelas, DEBES separarlos y detallar la información de cada uno.
Para CADA terreno/parcela encontrado, generá un bloque de información que tenga el formato de una página de Wiki en Obsidian, empezando SIEMPRE con el siguiente bloque YAML (NO ESCRIBAS ```yaml ni ```):

---
tipo: inmueble
direccion: "[Dirección si existe o descripcion]"
localidad: "[Localidad]"
matricula_folio_real: "[Extraer]"
nomenclatura_castastral: "[Extraer]"
partida_inmobiliaria: "[Extraer]"
titulares: ["[Extraer titulares]"]
estado_legal: "[Extraer estado legal, ej: Limpio, Embargado, Bien de Familia]"
superficie: "[Extraer superficie/medidas]"
ultima_actualizacion: 2026-05-02
---

Luego del YAML, escribí un encabezado Markdown con el nombre del terreno y un resumen detallado de las observaciones legales, embargos, historial de ventas, valuación fiscal, etc. que encuentres en los documentos.
Ignorá datos irrelevantes, pero extraé con precisión números, folios, fincas, y nombres. No uses backticks para encerrar el bloque yaml, escribí los tres guiones directamente.
"""
    print("Enviando prompt al modelo...")
    try:
        response = model.generate_content([prompt] + uploaded_files, request_options={"timeout": 600})
        output_path = os.path.join("/Volumes/Proyectos/Escrituras/wiki/propiedades", f"{output_name}.md")
        with open(output_path, "w") as f:
            f.write(response.text)
        print(f"Análisis guardado en {output_path}")
    except Exception as e:
        print(f"Error en generación: {e}")

if __name__ == "__main__":
    folders_to_process = [
        ("Machagai - Alberdi", "Machagai - Alberdi (IA)"),
        ("Machagai - Carlitos", "Machagai - Carlitos (IA)"),
        ("Machagai - Donacion Angel la Gata", "Machagai - Donacion Angel la Gata (IA)"),
        ("Machagai - Donacion Benchu", "Machagai - Donacion Benchu (IA)"),
        ("Machagai - Encina", "Machagai - Encina (IA)"),
        ("Machagai - Farmacia", "Machagai - Farmacia (IA)"),
        ("Resistencia - Domicilio", "Resistencia - Domicilio (IA)")
    ]
    base_path = "/Volumes/Proyectos/Escrituras/attachments/propiedades"
    for folder, output in folders_to_process:
        analyze_folder(os.path.join(base_path, folder), output)
