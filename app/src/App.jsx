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

function Dashboard({ properties }) {
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
            <span className="text-2xl font-black tracking-tight text-orange-400">$0</span>
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
  const property = useMemo(() => properties.find(p => p.id === id), [id, properties]);

  const coords = useMemo(() => {
    if (!property?.coordenadas) return [-27.45, -58.98];
    const parts = property.coordenadas.replace(/"/g, '').split(',');
    return [parseFloat(parts[0]), parseFloat(parts[1])];
  }, [property]);

  if (!property) return <div className="p-10 text-white">Propiedad no encontrada.</div>;

  return (
    <main className="flex flex-col animate-in fade-in duration-700 h-full overflow-y-auto bg-[#020617] z-0 relative">
      <div className="w-full bg-slate-900 border-b border-white/10 relative overflow-hidden flex-shrink-0" style={{ height: '400px' }}>
        {property.foto_url && (
          <img src={property.foto_url} className="absolute inset-0 w-full h-full object-cover brightness-75 z-0" alt="Portada" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent z-10" />
        <div className="absolute bottom-10 left-12 flex flex-col gap-3 z-20">
          <button onClick={() => navigate('/')} className="w-fit px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all mb-4">← Volver</button>
          <h1 className="text-5xl font-black text-white tracking-tighter">{property.id}</h1>
          <div className="flex items-center gap-3 text-orange-400">
            <span className="material-symbols-outlined !text-[20px]">location_on</span>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black">{property.localidad}</p>
          </div>
        </div>
      </div>

      <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-[1800px] mx-auto w-full relative z-30">
        <div className="lg:col-span-2 flex flex-col gap-10">
          <div className="kpi-card p-12">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase block mb-10">Ficha Técnica Legal</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-3">Nomenclatura Catastral</label>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{property.nomenclatura || "---"}</p>
              </div>
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-3">Matrícula / Folio Real</label>
                <p className="text-sm text-slate-300 font-medium">{property.matricula || "---"}</p>
              </div>
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-3">Superficie Total</label>
                <p className="text-sm text-slate-200 font-bold leading-relaxed">{property.superficie_m2} m²</p>
              </div>
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-3">Titular Dominial</label>
                <p className="text-sm text-orange-200/80 font-bold leading-relaxed">{property.titulares?.join(', ')}</p>
              </div>
              <div className="md:col-span-2 p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
                <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-3">Ubicación de Referencia</label>
                <p className="text-sm text-slate-400 leading-relaxed italic">"{property.direccion}"</p>
              </div>
            </div>
          </div>

          <div className="kpi-card p-12">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase block mb-10">Historial y Auditoría Legal</span>
            <div className="prose prose-invert prose-sm max-w-none text-slate-400 leading-relaxed space-y-6">
              <div dangerouslySetInnerHTML={{ __html: (property.resumen || "").replace(/\n/g, '<br/>') }} />
            </div>
          </div>

          {/* NUEVA SECCIÓN: CUENTA CORRIENTE DETALLADA */}
          <div className="kpi-card p-10 border-orange-500/10">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Cuenta Corriente de Activo</span>
              <button className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[9px] font-black text-orange-400 hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest">
                + Cargar Comprobante
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] text-slate-600 uppercase font-black tracking-widest border-b border-white/5">
                    <th className="py-4">Fecha</th>
                    <th className="py-4">Cuenta</th>
                    <th className="py-4">Concepto</th>
                    <th className="py-4 text-right">Monto</th>
                    <th className="py-4 text-center w-20">Doc</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {/* Aquí mapearemos los movimientos de Supabase más adelante */}
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-600 italic">
                      No se registran movimientos contables para esta propiedad.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="kpi-card h-64 overflow-hidden relative z-10">
            <MapContainer center={coords} zoom={14} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={coords} />
            </MapContainer>
          </div>

          <div className="kpi-card p-10">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase block mb-8">Gestión de Cuentas</span>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Saldo Impuestos</span>
                  <span className="text-[10px] font-black px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">$0</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Saldo Multas</span>
                  <span className="text-[10px] font-black px-3 py-1 bg-slate-800 text-slate-500 border border-white/5 rounded-full">$0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) console.error('Error fetching properties:', error);
      else setProperties(data);
      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-white font-black tracking-widest">LOADING DATABASE...</div>;

  return (
    <BrowserRouter>
      <div className="h-screen bg-[#020617] flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col h-full overflow-y-auto scroll-smooth">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard properties={properties} />} />
            <Route path="/property/:id" element={<PropertyDetail properties={properties} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
