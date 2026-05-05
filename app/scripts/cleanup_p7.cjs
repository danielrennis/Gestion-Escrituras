const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://zfwexmhfybvuscaejfuq.supabase.co';

let SUPABASE_SERVICE_ROLE_KEY = '';
const envPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const serviceMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
  if (serviceMatch) SUPABASE_SERVICE_ROLE_KEY = serviceMatch[1].trim();
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: No se encontró la clave en .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const cleanup = async () => {
  console.log('🧹 Eliminando Parcela 7 de Supabase...');
  
  const { error } = await supabase
    .from('propiedades')
    .delete()
    .eq('id', 'Machagai - Ruta 16 - Chacra 30 - Parcela 7');

  if (error) {
    console.error('❌ Error eliminando Parcela 7:', error.message);
  } else {
    console.log('✅ Parcela 7 eliminada correctamente.');
  }
};

cleanup();
