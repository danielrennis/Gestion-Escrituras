import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import propertiesData from './data/properties.json';
import mainPhoto from './assets/portada_test.png';

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
          <span className="material-symbols-outlined !text-[20px]">gavel</span>
          <span className="text-xs font-semibold uppercase tracking-wider">Legales</span>
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
          <button className="hover:text-white transition-colors"><span className="material-symbols-outlined !text-[22px]">account_balance</span></button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-700 shadow-inner" />
        </div>
      </div>
    </header>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  
  const stats = useMemo(() => {
    let totalSurface = 0;
    propertiesData.forEach(p => {
      const supStr = p.superficie || "0";
      // Basic extraction of numbers for "4 Hectáreas" or "622,50 m²"
      const match = supStr.replace(',', '.').match(/([\d.]+)/);
      if (match) {
        let val = parseFloat(match[1]);
        if (supStr.toLowerCase().includes('hect')) val *= 10000;
        totalSurface += val;
      }
    });
    return {
      count: propertiesData.length,
      surface: (totalSurface / 10000).toFixed(2) // Total in Ha
    };
  }, []);

  return (
    <main className="p-8 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card p-5">
          <span className="text-[10px] font-black text-slate-500 tracking-[0.15em] uppercase">Propiedades Totales</span>
          <div className="flex items-baseline justify-end gap-2 mt-1">
            <span className="text-2xl font-black tracking-tight text-white">{stats.count}</span>
          </div>
          <span className="text-[10px] text-slate-600 mt-1 font-medium block text-right">Sincronizado con Obsidian</span>
        </div>
        <div className="kpi-card p-5">
          <span className="text-[10px] font-black text-slate-500 tracking-[0.15em] uppercase">Superficie Total</span>
          <div className="flex items-baseline justify-end gap-2 mt-1">
            <span className="text-2xl font-black tracking-tight text-white">{Math.round(propertiesData.reduce((acc, p) => acc + parseInt(p.superficie_limpia), 0)).toLocaleString('es-AR')} m²</span>
          </div>
          <span className="text-[10px] text-slate-600 mt-1 font-medium block text-right">Suma de activos</span>
        </div>
        <div className="kpi-card p-5">
          <span className="text-[10px] font-black text-slate-500 tracking-[0.15em] uppercase">Valuación Estimada</span>
          <div className="flex items-baseline justify-end gap-2 mt-1">
            <span className="text-2xl font-black tracking-tight text-white">USD --</span>
          </div>
          <span className="text-[10px] text-slate-600 mt-1 font-medium block text-right">Pendiente Supabase</span>
        </div>
        <div className="kpi-card p-5">
          <span className="text-[10px] font-black text-slate-500 tracking-[0.15em] uppercase">Deuda / Multas</span>
          <div className="flex items-baseline justify-end gap-2 mt-1">
            <span className="text-2xl font-black tracking-tight text-emerald-400">$0.00</span>
          </div>
          <span className="text-[10px] text-slate-600 mt-1 font-medium block text-right">Sin alertas críticas</span>
        </div>
      </div>

      <div className="kpi-card overflow-hidden border-slate-800/40 bg-slate-950/40 backdrop-blur-md">
        <div className="px-6 py-4 border-b border-slate-800/50 bg-white/[0.02] flex justify-between items-center">
          <span className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase">Registro de Activos Dominiales</span>
          <div className="flex gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">Live Sync</span>
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
                <th className="px-4 py-3 text-right w-28">Valuación</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-slate-400">
              {propertiesData.map((row, i) => (
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
                    <div className="truncate opacity-60 group-hover:opacity-100" title={row.titulares_limpios.join(', ')}>{row.titulares_limpios[0] || "---"}</div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-orange-200/50 group-hover:text-orange-200">
                    {row.superficie_limpia}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-tighter ${row.estado_limpio.includes('Limpio') ? 'bg-emerald-500/5 text-emerald-400/80 border-emerald-500/10' : 'bg-amber-500/5 text-amber-400/80 border-amber-500/10'}`}>
                      {row.estado_limpio}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-black text-white/40 group-hover:text-white/90 rounded-r-xl border-r border-y border-transparent group-hover:border-orange-500/30">
                    USD 0
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

// Fix for default marker icon issues in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = useMemo(() => propertiesData.find(p => p.id === id), [id]);

  const coords = useMemo(() => {
    if (!property?.coordenadas) return [-27.45, -58.98]; // Default Resistencia
    const parts = property.coordenadas.replace(/"/g, '').split(',');
    return [parseFloat(parts[0]), parseFloat(parts[1])];
  }, [property]);

  if (!property) return <div className="p-10 text-white">Propiedad no encontrada.</div>;

  return (
    <main className="flex flex-col animate-in fade-in duration-700 h-full overflow-y-auto bg-[#020617] z-0 relative">
      {/* Header con Foto Principal - DINÁMICO */}
      <div className="w-full bg-slate-900 border-b border-white/10 relative overflow-hidden flex-shrink-0" style={{ height: '450px' }}>
        {property.foto_portada && (
          <img 
            src={property.foto_portada} 
            className="absolute inset-0 w-full h-full object-cover brightness-75 z-0"
            alt="Fondo Propiedad"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent z-10" />
        
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-20">
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-fit px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all mb-6"
            >
              ← Volver al Dashboard
            </button>
            <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">{property.id}</h1>
            <div className="flex items-center gap-3 text-orange-400">
              <span className="material-symbols-outlined !text-[20px]">location_on</span>
              <p className="text-[11px] uppercase tracking-[0.4em] font-black drop-shadow-md">{property.localidad}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido con Padding */}
      <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-[1800px] mx-auto w-full relative z-30">
        {/* Columna Izquierda: Información Principal */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          <div className="kpi-card p-12">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase block mb-10">Ficha Técnica Legal</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-3">Nomenclatura Catastral</label>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{property.nomenclatura_castastral || "---"}</p>
              </div>
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-3">Matrícula / Folio Real</label>
                <p className="text-sm text-slate-300 font-medium">{property.matricula_folio_real || "---"}</p>
              </div>
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-3">Superficie Total</label>
                <p className="text-sm text-slate-200 font-bold leading-relaxed">{property.superficie_limpia}</p>
                {property.superficie !== property.superficie_limpia && (
                  <p className="text-[9px] text-slate-500 mt-1 italic leading-tight">{property.superficie.replace(property.superficie_limpia, '').replace(/^\s*[\(]*/, '').replace(/[\)]*$/, '').trim()}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-black tracking-widest block mb-3">Titular Dominial</label>
                <p className="text-sm text-orange-200/80 font-bold leading-relaxed">{property.titulares_limpios.join(', ')}</p>
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
              {property.resumen ? (
                <div dangerouslySetInnerHTML={{ __html: property.resumen.replace(/\n/g, '<br/><br/>') }} />
              ) : (
                <p className="italic text-slate-600 font-light text-xs">No hay observaciones adicionales registradas en el legajo.</p>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Mapa y Documentos */}
        <div className="flex flex-col gap-10">
          {/* Mapa Interactiva Pequeño */}
          <div className="kpi-card h-72 overflow-hidden relative z-10">
            <div className="absolute top-5 left-5 z-[1000] px-4 py-2 bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Localización Exacta</span>
            </div>
            <MapContainer center={coords} zoom={14} scrollWheelZoom={false} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={coords}>
                <Popup><span className="text-[10px] font-bold">{property.id}</span></Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="kpi-card p-10">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase block mb-8">Métricas del Activo</span>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3 pb-6 border-b border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Estado Jurídico</span>
                <div className={`p-4 rounded-2xl border ${property.estado_limpio.includes('Limpio') ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                  <span className={`text-[10px] font-bold leading-tight block uppercase ${property.estado_limpio.includes('Limpio') ? 'text-emerald-400' : 'text-amber-400'}`}>{property.estado_limpio}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Impuestos / Tasas</span>
                <span className="text-[10px] font-black px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full uppercase">AL DÍA</span>
              </div>
            </div>
          </div>

          <div className="kpi-card p-8 bg-gradient-to-br from-orange-500/10 to-transparent">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase block mb-8">Documentación Digital</span>
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-[20px] flex items-center gap-4 hover:bg-white/[0.08] transition-all cursor-pointer group">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <span className="material-symbols-outlined !text-[20px]">description</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white font-bold uppercase tracking-tight">Escritura Principal</span>
                  <span className="text-[9px] text-slate-600 font-mono italic">PDF • 4.2 MB</span>
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
  return (
    <BrowserRouter>
      <div className="h-screen bg-[#020617] flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col h-full overflow-y-auto scroll-smooth">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
