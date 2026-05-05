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

const setupStorage = async () => {
  console.log('📦 Creando bucket de almacenamiento para comprobantes...');
  
  const { data, error } = await supabase.storage.createBucket('comprobantes', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ El bucket ya existe.');
    } else {
      console.error('❌ Error creando bucket:', error.message);
    }
  } else {
    console.log('✅ Bucket "comprobantes" creado con éxito.');
  }
};

setupStorage();
