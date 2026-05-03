import React, { useMemo, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase usando variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800/50 bg-slate-950/90 backdrop-blur-2xl flex flex-col py-8 z-50">
      <div className="px-8 mb-10 flex flex-col">
        <span className="text-lg font-black tracking-[0.2em] text-white">RENNIS REALTY</span>
        <span className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Management Console</span>
      </div>
      
      <div className="px-6 mb-8">
        <button className="w-full bg-white text-slate-950 font-bold py-2.5 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-white/5">
          <span className="material-symbols-outlined !text-[18px]">add</span>
          NUEVA PROPIEDAD
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-4">
        <Link to="/" className={isActive('/') ? 'sidebar-link-active' : 'sidebar-link'}>
          <span className="material-symbols-outlined !text-[20px]">dashboard</span>
          <span className="text-xs font-semibold uppercase tracking-wider">Dashboard</span>
        </Link>
        <Link to="#" className="sidebar-link">
          <span className="material-symbols-outlined !text-[20px]">domain</span>
          <span className="text-xs font-semibold uppercase tracking-wider">Propiedades</span>
        </Link>
        <Link to="#" className="sidebar-link">
          <span className="material-symbols-outlined !text-[20px]">account_balance</span>
          <span className="text-xs font-semibold uppercase tracking-wider">Cuenta Corriente</span>
        </Link>
      </nav>

      <style>{`
        @media print {
          aside, header, button, .no-print { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; background: white !important; color: black !important; }
          .kpi-card { border: 1px solid #eee !important; box-shadow: none !important; background: white !important; color: black !important; }
          .print-only { display: block !important; }
          .text-slate-400, .text-slate-500 { color: #555 !important; }
          .text-white { color: black !important; }
          img { max-height: 400px !important; width: 100% !important; object-fit: cover !important; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="mt-auto px-4 border-t border-slate-800/50 pt-6">
        <div className="sidebar-link opacity-50 cursor-not-allowed">
          <span className="material-symbols-outlined !text-[20px]">settings</span>
          <span className="text-xs font-semibold uppercase tracking-wider">Configuración</span>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/30 bg-slate-950/60 backdrop-blur-xl w-full flex items-center justify-between h-14 px-8">
      <div className="flex items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Panel de Control Gerencial</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-white transition-colors"><span className="material-symbols-outlined !text-[22px]">notifications</span></button>
          <button className="hover:text-white transition-colors"><span className="material-symbols-outlined !text-[22px]">database</span></button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-600 to-orange-900 border border-orange-500 shadow-inner" />
        </div>
      </div>
    </header>
  );
}

function Dashboard({ properties, globalDebt }) {
  const navigate = useNavigate();
  
  const stats = useMemo(() => {
    const totalSurface = properties.reduce((acc, p) => acc + (p.superficie_m2 || 0), 0);
    return {
      count: properties.length,
      surface: totalSurface.toLocaleString('es-AR')
    };
  }, [properties]);

  return (
    <main className="p-8 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card p-5">
          <span className="text-[10px] font-black text-slate-500 tracking-[0.15em] uppercase">Propiedades Totales</span>
          <div className="flex items-baseline justify-end gap-2 mt-1">
            <span className="text-2xl font-black tracking-tight text-white">{stats.count}</span>
          </div>
          <span className="text-[10px] text-slate-600 mt-1 font-medium block text-right">Supabase Cloud Active</span>
        </div>
        <div className="kpi-card p-5">
          <span className="text-[10px] font-black text-slate-500 tracking-[0.15em] uppercase">Superficie Total</span>
          <div className="flex items-baseline justify-end gap-2 mt-1">
            <span className="text-2xl font-black tracking-tight text-white">{stats.surface} m²</span>
          </div>
          <span className="text-[10px] text-slate-600 mt-1 font-medium block text-right">Suma de activos</span>
        </div>
        <div className="kpi-card p-5">
          <span className="text-[10px] font-black text-slate-500 tracking-[0.15em] uppercase">Saldo Deudor Total</span>
          <div className="flex items-baseline justify-end gap-2 mt-1">
            <span className={`text-2xl font-black tracking-tight ${globalDebt > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
              ${globalDebt.toLocaleString('es-AR')}
            </span>
          </div>
          <span className="text-[10px] text-slate-600 mt-1 font-medium block text-right">Impuestos + Multas</span>
        </div>
        <div className="kpi-card p-5">
          <span className="text-[10px] font-black text-slate-500 tracking-[0.15em] uppercase">Valuación Cartera</span>
          <div className="flex items-baseline justify-end gap-2 mt-1">
            <span className="text-2xl font-black tracking-tight text-emerald-400">USD --</span>
          </div>
          <span className="text-[10px] text-slate-600 mt-1 font-medium block text-right">Métrica en desarrollo</span>
        </div>
      </div>

      <div className="kpi-card overflow-hidden border-slate-800/40 bg-slate-950/40 backdrop-blur-md">
        <div className="px-6 py-4 border-b border-slate-800/50 bg-white/[0.02] flex justify-between items-center">
          <span className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase">Registro de Activos Dominiales</span>
          <div className="flex gap-2 text-emerald-500">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-bold uppercase tracking-widest">Supabase Connected</span>
          </div>
        </div>
        <div className="overflow-x-auto px-2 pb-2">
          <table className="w-full text-left border-separate border-spacing-y-1">
            <thead>
              <tr className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                <th className="px-4 py-3">ID Propiedad</th>
                <th className="px-4 py-3 w-40">Localidad</th>
                <th className="px-4 py-3 w-40">Titularidad</th>
                <th className="px-4 py-3 text-right w-24">Superficie</th>
                <th className="px-4 py-3 text-center w-28">Estatus Legal</th>
                <th className="px-4 py-3 text-right w-28">Deuda</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-slate-400">
              {properties.map((row, i) => (
                <tr 
                  key={i} 
                  className="bg-white/[0.01] hover:bg-orange-500/[0.06] border border-white/5 transition-all duration-200 cursor-pointer group" 
                  onClick={() => navigate(`/property/${row.id}`)}
                >
                  <td className="px-4 py-2.5 whitespace-nowrap rounded-l-xl border-l border-y border-transparent group-hover:border-orange-500/30">
                    <span className="font-mono font-bold text-slate-200 group-hover:text-white transition-colors">{row.id}</span>
                  </td>
                  <td className="px-4 py-2.5 italic font-light">
                    <div className="truncate opacity-60 group-hover:opacity-100 transition-opacity" title={row.localidad}>{row.localidad || "---"}</div>
                  </td>
                  <td className="px-4 py-2.5 font-medium">
                    <div className="truncate opacity-60 group-hover:opacity-100" title={row.titulares?.join(', ')}>{row.titulares?.[0] || "---"}</div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-orange-200/50 group-hover:text-orange-200">
                    {row.superficie_m2} m²
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-tighter ${row.estado_legal.includes('Limpio') ? 'bg-emerald-500/5 text-emerald-400/80 border-emerald-500/10' : 'bg-amber-500/5 text-amber-400/80 border-amber-500/10'}`}>
                      {row.estado_legal}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-black text-emerald-400/40 group-hover:text-emerald-400 rounded-r-xl border-r border-y border-transparent group-hover:border-orange-500/30">
                    $0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function PropertyDetail({ properties }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);
  const [loadingMov, setLoadingMov] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Estado para el formulario de carga
  const [formData, setFormData] = useState({
    cuenta: 'IMPUESTOS',
    tipo_movimiento: 'DEUDA',
    monto: '',
    descripcion: '',
    archivo_url: '',
    fecha_documento: new Date().toISOString().split('T')[0]
  });

  const [file, setFile] = useState(null);

  const property = useMemo(() => properties.find(p => p.id === id), [id, properties]);

  const fetchMovimientos = async () => {
    const { data, error } = await supabase
      .from('movimientos')
      .select('*')
      .eq('propiedad_id', id)
      .order('fecha_documento', { ascending: false });
    
    if (error) console.error('Error fetching movements:', error);
    else setMovimientos(data);
    setLoadingMov(false);
  };

  useEffect(() => {
    if (id) fetchMovimientos();
  }, [id]);

  const handleAddMovimiento = async (e) => {
    e.preventDefault();
    let finalUrl = '';

    // Si hay archivo, lo subimos primero
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('comprobantes')
        .upload(fileName, file);
      
      if (uploadError) {
        alert('Error al subir archivo: ' + uploadError.message);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('comprobantes')
        .getPublicUrl(fileName);
      
      finalUrl = publicUrl;
    }

    const { error } = await supabase
      .from('movimientos')
      .insert({
        ...formData,
        propiedad_id: id,
        monto: parseFloat(formData.monto),
        archivo_url: finalUrl || formData.archivo_url
      });
    
    if (error) {
      alert('Error al cargar movimiento: ' + error.message);
    } else {
      setShowForm(false);
      setFormData({ ...formData, monto: '', descripcion: '', archivo_url: '' });
      setFile(null);
      fetchMovimientos();
    }
  };

  const handleDeleteMovimiento = async (movId) => {
    if (!window.confirm('¿Confirmas que querés borrar este movimiento?')) return;
    const { error } = await supabase.from('movimientos').delete().eq('id', movId);
    if (error) alert('Error al borrar');
    else fetchMovimientos();
  };

  const movImpuestos = movimientos.filter(m => m.cuenta === 'IMPUESTOS');
  const movMultas = movimientos.filter(m => m.cuenta === 'MULTAS');

  const saldos = useMemo(() => {
    return movimientos.reduce((acc, mov) => {
      const monto = parseFloat(mov.monto);
      const factor = mov.tipo_movimiento === 'DEUDA' ? 1 : -1;
      acc[mov.cuenta] = (acc[mov.cuenta] || 0) + (monto * factor);
      return acc;
    }, { IMPUESTOS: 0, MULTAS: 0 });
  }, [movimientos]);

  const coords = useMemo(() => {
    if (!property?.coordenadas) return [-27.45, -58.98];
    const parts = property.coordenadas.replace(/"/g, '').split(',');
    return [parseFloat(parts[0]), parseFloat(parts[1])];
  }, [property]);

  if (!property) return <div className="p-10 text-white">Propiedad no encontrada.</div>;

  return (
    <main className="flex flex-col animate-in fade-in duration-700 h-full overflow-y-auto bg-[#020617] z-0 relative pb-20">
      <div className="w-full bg-slate-900 border-b border-white/10 relative overflow-hidden flex-shrink-0" style={{ height: '350px' }}>
        {property.foto_url && (
          <img src={property.foto_url} className="absolute inset-0 w-full h-full object-cover brightness-75 z-0" alt="Portada" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent z-10" />
        <div className="absolute bottom-10 left-12 flex flex-col gap-3 z-20">
          <div className="flex gap-4 mb-4 no-print">
            <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">← Volver</button>
            <button onClick={() => window.print()} className="px-6 py-2 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2">
              <span className="material-symbols-outlined !text-[16px]">picture_as_pdf</span>
              Generar Ficha
            </button>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">{property.id}</h1>
          <div className="flex items-center gap-3 text-orange-400">
            <span className="material-symbols-outlined !text-[20px]">location_on</span>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black">{property.localidad}</p>
          </div>
        </div>
      </div>

      <div className="px-12 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8 w-full relative z-30">
        
        {/* PANEL LATERAL: MAPA Y SALDOS */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          <div className="kpi-card h-64 overflow-hidden relative">
            <MapContainer center={coords} zoom={14} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={coords} />
            </MapContainer>
          </div>

          <div className="kpi-card p-8">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase block mb-6">Resumen de Cuenta</span>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Impuestos</span>
                <span className={`text-2xl font-black ${saldos.IMPUESTOS > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  ${saldos.IMPUESTOS.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Multas</span>
                <span className={`text-2xl font-black ${saldos.MULTAS > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  ${saldos.MULTAS.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowForm(!showForm)}
            className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {showForm ? '× Cancelar Carga' : '+ Cargar Movimiento'}
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL: TABLAS */}
        <div className="lg:col-span-3 flex flex-col gap-8 order-1 lg:order-2">
          
          {showForm && (
            <div className="kpi-card p-10 border-orange-500/30 animate-in slide-in-from-top duration-300">
              <form onSubmit={handleAddMovimiento} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Cuenta</label>
                  <select 
                    value={formData.cuenta}
                    onChange={e => setFormData({...formData, cuenta: e.target.value})}
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-orange-500/50"
                  >
                    <option value="IMPUESTOS">IMPUESTOS</option>
                    <option value="MULTAS">MULTAS</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Tipo</label>
                  <select 
                    value={formData.tipo_movimiento}
                    onChange={e => setFormData({...formData, tipo_movimiento: e.target.value})}
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-orange-500/50"
                  >
                    <option value="DEUDA">DEUDA (SUMA)</option>
                    <option value="PAGO">PAGO (RESTA)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Monto ($)</label>
                  <input 
                    type="number"
                    required
                    value={formData.monto}
                    onChange={e => setFormData({...formData, monto: e.target.value})}
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-orange-500/50"
                    placeholder="Ej: 15000"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Descripción / Concepto</label>
                  <input 
                    type="text"
                    required
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-orange-500/50"
                    placeholder="Ej: Cuota 1 Plan de Pago"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Adjuntar Comprobante (Foto/PDF)</label>
                  <input 
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => setFile(e.target.files[0])}
                    className="bg-slate-800 border border-white/10 rounded-xl p-2.5 text-white text-[10px] outline-none focus:border-orange-500/50 file:bg-orange-500/10 file:border-0 file:text-orange-500 file:text-[9px] file:font-black file:uppercase file:px-4 file:py-1 file:rounded-lg file:mr-4"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Fecha</label>
                  <input 
                    type="date"
                    required
                    value={formData.fecha_documento}
                    onChange={e => setFormData({...formData, fecha_documento: e.target.value})}
                    className="bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-orange-500/50"
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="w-full py-4 bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                    Confirmar Registro en Supabase
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* TABLA IMPUESTOS */}
            <div className="kpi-card p-8 border-blue-500/10">
              <span className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase block mb-6">Cuenta Corriente Impuestos</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-600 font-black uppercase tracking-widest">
                      <th className="pb-4">Fecha</th>
                      <th className="pb-4">Concepto</th>
                      <th className="pb-4 text-right">Monto</th>
                      <th className="pb-4 w-8"></th>
                      <th className="pb-4 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {movImpuestos.map(m => (
                      <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                        <td className="py-4 font-mono text-slate-500">{m.fecha_documento}</td>
                        <td className="py-4 text-slate-300">{m.descripcion}</td>
                        <td className={`py-4 text-right font-bold ${m.tipo_movimiento === 'DEUDA' ? 'text-orange-400' : 'text-emerald-400'}`}>
                          {m.tipo_movimiento === 'DEUDA' ? '-' : '+'} ${parseFloat(m.monto).toLocaleString('es-AR')}
                        </td>
                        <td className="py-4 text-right">
                          {m.archivo_url && (
                            <a href={m.archivo_url} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-white transition-colors">
                              <span className="material-symbols-outlined !text-[16px]">attachment</span>
                            </a>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleDeleteMovimiento(m.id)} className="text-slate-700 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined !text-[16px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {movImpuestos.length === 0 && (
                      <tr><td colSpan="4" className="py-10 text-center text-slate-600 italic">Sin movimientos</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA MULTAS */}
            <div className="kpi-card p-8 border-purple-500/10">
              <span className="text-[10px] font-black text-purple-400 tracking-[0.2em] uppercase block mb-6">Cuenta Corriente Multas</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-600 font-black uppercase tracking-widest">
                      <th className="pb-4">Fecha</th>
                      <th className="pb-4">Concepto</th>
                      <th className="pb-4 text-right">Monto</th>
                      <th className="pb-4 w-8"></th>
                      <th className="pb-4 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {movMultas.map(m => (
                      <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                        <td className="py-4 font-mono text-slate-500">{m.fecha_documento}</td>
                        <td className="py-4 text-slate-300">{m.descripcion}</td>
                        <td className={`py-4 text-right font-bold ${m.tipo_movimiento === 'DEUDA' ? 'text-orange-400' : 'text-emerald-400'}`}>
                          {m.tipo_movimiento === 'DEUDA' ? '-' : '+'} ${parseFloat(m.monto).toLocaleString('es-AR')}
                        </td>
                        <td className="py-4 text-right">
                          {m.archivo_url && (
                            <a href={m.archivo_url} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-white transition-colors">
                              <span className="material-symbols-outlined !text-[16px]">attachment</span>
                            </a>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleDeleteMovimiento(m.id)} className="text-slate-700 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined !text-[16px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {movMultas.length === 0 && (
                      <tr><td colSpan="4" className="py-10 text-center text-slate-600 italic">Sin movimientos</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="kpi-card p-10">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase block mb-8">Información Histórica</span>
            <div className="prose prose-invert prose-sm max-w-none text-slate-400 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: (property.resumen || "").replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default function App() {
  const [properties, setProperties] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: props, error: propsError } = await supabase
        .from('propiedades')
        .select('*')
        .order('id', { ascending: true });
      
      const { data: movs, error: movsError } = await supabase
        .from('movimientos')
        .select('*');
      
      if (propsError) console.error('Error fetching properties:', propsError);
      if (movsError) console.error('Error fetching movements:', movsError);

      setProperties(props || []);
      setMovimientos(movs || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const globalTotalDeuda = useMemo(() => {
    return movimientos.reduce((acc, mov) => {
      const monto = parseFloat(mov.monto);
      const factor = mov.tipo_movimiento === 'DEUDA' ? 1 : -1;
      return acc + (monto * factor);
    }, 0);
  }, [movimientos]);

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-white font-black tracking-widest">LOADING DATABASE...</div>;

  return (
    <BrowserRouter>
      <div className="h-screen bg-[#020617] flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col h-full overflow-y-auto scroll-smooth">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard properties={properties} globalDebt={globalTotalDeuda} />} />
            <Route path="/property/:id" element={<PropertyDetail properties={properties} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
