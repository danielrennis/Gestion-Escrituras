const { createClient } = require('@supabase/supabase-js');

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://zfwexmhfybvuscaejfuq.supabase.co';
let SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SECRET_KEY';

// Intentar cargar la clave desde .env.local
const envPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const serviceMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
  if (serviceMatch) SUPABASE_SERVICE_ROLE_KEY = serviceMatch[1].trim();
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const updateLink = async () => {
  const { error } = await supabase
    .from('movimientos')
    .update({ archivo_url: '/attachments/Machagai-Encina-Multa_Malezas_2025_Acta.jpg' })
    .eq('propiedad_id', 'Machagai - Encina')
    .eq('monto', 1375000);

  if (error) console.error('Error:', error.message);
  else console.log('✅ Link actualizado correctamente.');
};

updateLink();
