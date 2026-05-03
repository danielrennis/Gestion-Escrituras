const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://zfwexmhfybvuscaejfuq.supabase.co';

// Intentar cargar la clave desde .env.local
let SUPABASE_SERVICE_ROLE_KEY = '';
const envPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const serviceMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
  const anonMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
  if (serviceMatch) SUPABASE_SERVICE_ROLE_KEY = serviceMatch[1].trim();
  else if (anonMatch) SUPABASE_SERVICE_ROLE_KEY = anonMatch[1].trim();
}

if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === 'SECRET_KEY_REMOVED') {
  console.error('❌ Error: No se encontró la clave en .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const syncData = async () => {
  const jsonPath = path.join(__dirname, '../src/data/properties.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ No se encontró properties.json');
    return;
  }

  const properties = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`🚀 Sincronizando ${properties.length} propiedades...`);

  for (const p of properties) {
    const { error } = await supabase
      .from('propiedades')
      .upsert({
        id: p.id,
        tipo: p.tipo,
        localidad: p.localidad,
        direccion: p.direccion,
        superficie_m2: parseInt(p.superficie_limpia),
        estado_legal: p.estado_limpio,
        titulares: p.titulares_limpios,
        foto_url: p.foto_portada,
        resumen: p.resumen,
        coordenadas: p.coordenadas,
        nomenclatura: p.nomenclatura_castastral,
        matricula: p.matricula_folio_real
      });

    if (error) {
      console.error(`❌ Error en ${p.id}:`, error.message);
    } else {
      console.log(`✅ Sincronizada: ${p.id}`);
    }
  }

  console.log('\n✨ Sincronización finalizada.');
};

syncData();
