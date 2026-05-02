const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const projectRoot = path.join(__dirname, '../../');
const propertiesDir = path.join(projectRoot, 'wiki/propiedades');
const outputFilePath = path.join(projectRoot, 'app/src/data/properties.json');
const destDir = path.join(projectRoot, 'app/public/photos');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const cleanName = (name) => {
  if (!name) return "";
  
  // 1. Quitar corchetes, prefijos y datos en paréntesis
  let n = name.replace(/\[\[|\]\]/g, '')
              .replace(/^(Nudo Propietario|Usufructuario|Titular|Vendedor|Comprador|Anterior titular|Nuevo titular):\s*/i, '')
              .split('(')[0]
              .trim();

  // 2. Reemplazo específico de Chacon por Hugo Daniel Rennis
  if (n.toLowerCase().includes('chacon')) return "Hugo Daniel Rennis";

  // 3. Convertir APELLIDOS MAYÚSCULAS a Proper Case
  return n.split(' ').map(word => {
    if (word.length > 1 && word === word.toUpperCase()) {
      return word.charAt(0) + word.slice(1).toLowerCase();
    }
    return word;
  }).join(' ');
};

const cleanSurface = (sup) => {
  if (!sup) return "---";
  const match = sup.match(/^([\d,.]+)\s*(m²|m2|Ha|hectáreas|hectareas|h)/i);
  if (match) {
    let valStr = match[1];
    if (valStr.includes(',') && valStr.includes('.')) {
      valStr = valStr.replace(/\./g, '').replace(',', '.');
    } else if (valStr.includes(',')) {
      valStr = valStr.replace(',', '.');
    }
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

  console.log(`🔍 Limpiando titulares y estandarizando nombres...`);

  files.forEach(file => {
    if (!file.endsWith('.md')) return;

    const filePath = path.join(propertiesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    try {
      const { data, content } = matter(fileContent);
      
      const tipo = (data.tipo || "").toLowerCase();
      if (tipo === 'inmueble' || tipo === 'lote') {
        
        let localidad = data.localidad || "";
        localidad = localidad.replace(/Departamento.*?,/gi, '').replace(/Provincia.*?/gi, '').replace(/,\s*,/g, ',').trim();
        if (localidad && !localidad.toLowerCase().includes('chaco')) localidad += ', Chaco';

        let foto_url = null;
        if (data.foto_portada) {
          const sourcePath = path.join(projectRoot, data.foto_portada);
          const slug = file.replace('.md', '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const ext = path.extname(data.foto_portada) || '.png';
          const destName = `${slug}_portada${ext}`;
          const destPath = path.join(destDir, destName);
          if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            foto_url = `/photos/${destName}`;
          }
        }

        // Limpiar lista de titulares y filtrar duplicados o vacíos
        const titularesLimpios = (data.titulares || [])
          .map(t => cleanName(t))
          .filter(t => t.length > 0);
        
        // Si hay varios y uno es Hugo Daniel Rennis, ponerlo primero
        titularesLimpios.sort((a, b) => a.includes('Hugo Daniel') ? -1 : 1);
        
        // Eliminar duplicados exactos (ej: si Chacon y Rennis resultan en el mismo nombre)
        const titularesUnicos = [...new Set(titularesLimpios)];

        properties.push({
          id: file.replace('.md', ''),
          filename: file,
          ...data,
          localidad: localidad,
          superficie_limpia: cleanSurface(data.superficie),
          estado_limpio: cleanStatus(data.estado_legal),
          titulares_limpios: titularesUnicos,
          foto_portada: foto_url,
          resumen: content.split('##')[0].replace(/#.*?\n/, '').trim()
        });
      }
    } catch (err) {
      console.error(`❌ Error en ${file}:`, err.message);
    }
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(properties, null, 2));
  console.log(`✅ Indexación exitosa. Titulares normalizados.`);
};

parseProperties();
