const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const projectRoot = path.join(__dirname, '../../');
const propertiesDir = path.join(projectRoot, 'wiki/propiedades');
const outputFilePath = path.join(projectRoot, 'app/src/data/properties.json');
const destPhotosDir = path.join(projectRoot, 'app/public/photos');
const destDocsDir = path.join(projectRoot, 'app/public/attachments');

if (!fs.existsSync(destPhotosDir)) fs.mkdirSync(destPhotosDir, { recursive: true });
if (!fs.existsSync(destDocsDir)) fs.mkdirSync(destDocsDir, { recursive: true });

const cleanName = (name) => {
  if (!name) return "";
  let n = name.replace(/\[\[|\]\]/g, '').replace(/^(Nudo Propietario|Usufructuario|Titular|Vendedor|Comprador|Anterior titular|Nuevo titular):\s*/i, '').split('(')[0].trim();
  if (n.toLowerCase().includes('chacon')) return "Hugo Daniel Rennis";
  return n.split(' ').map(word => (word.length > 1 && word === word.toUpperCase()) ? word.charAt(0) + word.slice(1).toLowerCase() : word).join(' ');
};

const cleanSurface = (sup) => {
  if (!sup) return "---";
  const match = sup.match(/^([\d,.]+)\s*(m²|m2|Ha|hectáreas|hectareas|h)/i);
  if (match) {
    let valStr = match[1];
    if (valStr.includes(',') && valStr.includes('.')) valStr = valStr.replace(/\./g, '').replace(',', '.');
    else if (valStr.includes(',')) valStr = valStr.replace(',', '.');
    let num = parseFloat(valStr);
    if (isNaN(num)) return sup.split('(')[0].trim();
    if (match[2].toLowerCase().includes('h')) num = num * 10000;
    return `${Math.round(num)} m²`;
  }
  return sup.split('(')[0].trim();
};

const cleanStatus = (status) => {
  if (!status) return "Verificar";
  const s = status.toLowerCase();
  if (s.includes('limpio') && s.includes('usufructo')) return "Limpio - Usufructo";
  if (s.includes('limpio')) return "Limpio";
  if (s.includes('deuda')) return "Con Deuda";
  return status.split('(')[0].trim().substring(0, 20);
};

const parseProperties = () => {
  const files = fs.readdirSync(propertiesDir);
  const properties = [];

  files.forEach(file => {
    if (!file.endsWith('.md')) return;

    const filePath = path.join(propertiesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    try {
      const { data, content } = matter(fileContent);
      
      const tipo = (data.tipo || "").toLowerCase();
      if (tipo === 'inmueble' || tipo === 'lote') {
        
        // 1. Procesar Portada
        let foto_url = null;
        if (data.foto_portada) {
          const sourcePath = path.join(projectRoot, data.foto_portada);
          const slug = file.replace('.md', '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const ext = path.extname(data.foto_portada) || '.png';
          const destName = `${slug}_portada${ext}`;
          if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, path.join(destPhotosDir, destName));
            foto_url = `/photos/${destName}`;
          }
        }

        // 2. Extraer Adjuntos (Escrituras, etc.)
        const adjuntos = [];
        const adjuntosMatch = content.match(/## Documentación Adjunta\n([\s\S]*?)(?=\n#|$)/);
        if (adjuntosMatch) {
          const lines = adjuntosMatch[1].split('\n');
          lines.forEach(line => {
            const fileMatch = line.match(/\[(.*?)\]\((.*?)\)/);
            if (fileMatch) {
              const fileName = fileMatch[1];
              const filePathRaw = fileMatch[2].replace('file://', '').replace(/%20/g, ' ');
              
              // Copiar el archivo real a la carpeta pública si existe
              if (fs.existsSync(filePathRaw)) {
                const ext = path.extname(filePathRaw);
                const safeName = `${file.replace('.md', '')}_${fileName}`.replace(/[^a-z0-9.]+/gi, '-');
                fs.copyFileSync(filePathRaw, path.join(destDocsDir, safeName));
                adjuntos.push({ nombre: fileName, url: `/attachments/${safeName}` });
              }
            }
          });
        }

        properties.push({
          id: file.replace('.md', ''),
          ...data,
          superficie_limpia: cleanSurface(data.superficie),
          estado_limpio: cleanStatus(data.estado_legal),
          titulares_limpios: (data.titulares || []).map(t => cleanName(t)).filter(t => t.length > 0),
          foto_portada: foto_url,
          adjuntos: adjuntos,
          resumen: content.split('##')[0].replace(/#.*?\n/, '').trim()
        });
      }
    } catch (err) {
      console.error(`❌ Error en ${file}:`, err.message);
    }
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(properties, null, 2));
  console.log(`✅ Indexación completa con ${properties.length} propiedades y sus documentos.`);
};

parseProperties();
