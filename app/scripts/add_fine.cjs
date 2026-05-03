const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zfwexmhfybvuscaejfuq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'SECRET_KEY_REMOVED';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const addFine = async () => {
  console.log('💰 Cargando deuda de multa para Machagai - Encina...');
  
  const { error } = await supabase
    .from('movimientos')
    .insert({
      propiedad_id: 'Machagai - Encina',
      tipo_movimiento: 'DEUDA',
      cuenta: 'MULTAS',
      monto: 1375000,
      fecha_documento: '2025-08-20',
      descripcion: 'Multa por malezas (1.000 UF) - Plan de 12 cuotas. Exp. 0041/25',
      archivo_url: '/attachments/Machagai-Encina_Multa_Malezas_2025_Acta.jpg'
    });

  if (error) {
    console.error('❌ Error cargando deuda:', error.message);
  } else {
    console.log('✅ Deuda cargada con éxito.');
  }
};

addFine();
