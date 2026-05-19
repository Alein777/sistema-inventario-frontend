import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast';
import {
  Plus, Search, Pencil, PowerOff, Eye,
  Building2, Phone, Mail, Globe, MapPin, Layers,
  CheckCircle, XCircle
} from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 14, width: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ width: 30, height: 30, border: 'none', background: '#f4f6f9', borderRadius: 6, cursor: 'pointer', fontSize: 16, color: 'var(--muted)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// COMPONENTE DETALLE: Lee el país guardado de la BD real
function ProveedorDetalle({ proveedor, onClose }) {
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    api.get('/departamentos')
      .then(({ data }) => {
        setDepartamentos(data.data || data);
      })
      .catch(() => {});
  }, []);

  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 };
  const valueStyle = { fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 };
  const blockStyle = { display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 0' };
  const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderBottom: '1px solid #f1f5f9' };

  const nombrePais = proveedor.pais || (proveedor.tipo === 'Nacional' ? 'El Salvador' : 'No registrado');
  
  const idDepto = proveedor.municipio?.id_departamento;
  const deptoEncontrado = departamentos.find(d => String(d.id) === String(idDepto));
  const textDepto = deptoEncontrado ? deptoEncontrado.nombre : '—';
  const nombreMunicipio = proveedor.municipio?.nombre || '—';

  return (
    <div>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        <div style={{ ...rowStyle, gridTemplateColumns: '1fr' }}>
          <div style={blockStyle}>
            <span style={labelStyle}>Nombre de la Empresa</span>
            <span style={{ ...valueStyle, fontSize: 16, fontWeight: 700 }}>
              <Building2 size={16} color="var(--accent)" /> {proveedor.nombre}
            </span>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={blockStyle}>
            <span style={labelStyle}>Contacto</span>
            <span style={valueStyle}>{proveedor.contacto}</span>
          </div>
          <div style={blockStyle}>
            <span style={labelStyle}>Teléfono</span>
            <span style={valueStyle}>
              <Phone size={14} color="var(--muted)" /> {proveedor.telefono}
            </span>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={blockStyle}>
            <span style={labelStyle}>Correo Electrónico</span>
            <span style={{ ...valueStyle, color: proveedor.email ? 'var(--accent)' : 'var(--muted)' }}>
              <Mail size={14} color="var(--muted)" /> {proveedor.email || 'No registrado'}
            </span>
          </div>
          <div style={blockStyle}>
            <span style={labelStyle}>Tipo de Proveedor</span>
            <span style={valueStyle}>
              <span style={{ background: '#f0f2f5', color: '#6b7280', fontSize: 11, padding: '2px 8px', borderRadius: 5, fontWeight: 600 }}>
                {proveedor.tipo || 'No especificado'}
              </span>
            </span>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={blockStyle}>
            <span style={labelStyle}>País</span>
            <span style={valueStyle}>
              <Globe size={14} color="var(--muted)" /> {nombrePais}
            </span>
          </div>
          <div style={blockStyle}>
            <span style={labelStyle}>Estado</span>
            <span style={valueStyle}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                background: proveedor.estado === 1 ? '#f0fdf4' : '#f1f5f9',
                color: proveedor.estado === 1 ? 'var(--success)' : 'var(--muted)'
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                {proveedor.estado === 1 ? 'Activo' : 'Inactivo'}
              </span>
            </span>
          </div>
        </div>

        {proveedor.tipo === 'Nacional' && (
          <div style={{ ...rowStyle, borderBottom: 'none' }}>
            <div style={blockStyle}>
              <span style={labelStyle}>Departamento</span>
              <span style={valueStyle}>
                <MapPin size={14} color="var(--muted)" /> {textDepto}
              </span>
            </div>
            <div style={blockStyle}>
              <span style={labelStyle}>Municipio</span>
              <span style={valueStyle}>
                <MapPin size={14} color="var(--muted)" /> {nombreMunicipio}
              </span>
            </div>
          </div>
        )}

      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Cerrar Vista
        </button>
      </div>
    </div>
  );
}

function ProveedorForm({ inicial, onSave, onClose }) {
  const [form, setForm] = useState({
    nombre:       inicial?.nombre        || '',
    contacto:     inicial?.contacto      || '',
    telefono:     inicial?.telefono      || '',
    email:        inicial?.email         || '',
    tipo:         inicial?.tipo          || '',
    pais:         inicial?.pais          || '',
    id_municipio: inicial?.id_municipio || '',
  });
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios]       = useState([]);
  const [deptoSel, setDeptoSel]           = useState('');
  const [loading, setLoading]             = useState(false);

  useEffect(() => {
    api.get('/departamentos').then(({ data }) => {
      setDepartamentos(data.data || data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (inicial?.municipio?.id_departamento) {
      const depId = inicial.municipio.id_departamento;
      setDeptoSel(depId);
      api.get(`/departamentos/${depId}/municipios`).then(({ data }) => {
        setMunicipios(data.data || data);
      });
    }
  }, [inicial]);

  const handleDepto = async (e) => {
    const id = e.target.value;
    setDeptoSel(id);
    setForm(f => ({ ...f, id_municipio: '' }));
    if (!id) { setMunicipios([]); return; }
    try {
      const { data } = await api.get(`/departamentos/${id}/municipios`);
      setMunicipios(data.data || data);
    } catch { setMunicipios([]); }
  };

  const set = (k) => (e) => {
    const value = e.target.value;
    setForm(f => {
      const nuevoForm = { ...f, [k]: value };
      
      if (k === 'tipo') {
        if (value !== 'Nacional') {
          setDeptoSel('');
          setMunicipios([]);
          nuevoForm.id_municipio = '';
        }
        if (value === 'Nacional') {
          nuevoForm.pais = 'El Salvador';
        } else if (!inicial?.id) {
          nuevoForm.pais = ''; 
        }
      }
      return nuevoForm;
    });
  };

  const handleTelefono = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setForm(f => ({ ...f, telefono: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim())          { toast.error('Ingresa el nombre');              return; }
    if (!form.contacto.trim())        { toast.error('Ingresa el contacto');            return; }
    if (form.telefono.length !== 8)   { toast.error('El teléfono debe tener 8 dígitos'); return; }
    if (!form.tipo)                   { toast.error('Selecciona el tipo de proveedor'); return; }
    if (!form.pais.trim())            { toast.error('Ingresa el país');                return; }
    
    if (form.tipo === 'Nacional') {
      if (!deptoSel)              { toast.error('Selecciona el departamento'); return; }
      if (!form.id_municipio)    { toast.error('Selecciona el municipio'); return; }
    }

    setLoading(true);
    try {
      if (inicial?.id) {
        await api.put(`/proveedores/${inicial.id}`, { ...form, estado: inicial.estado });
        toast.success('Proveedor actualizado');
      } else {
        await api.post('/proveedores', { ...form, estado: 1 });
        toast.success('Proveedor creado');
      }
      onSave();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', width: '100%' };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 };
  const field = { display: 'flex', flexDirection: 'column', gap: 5 };
  const row   = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div style={field}>
          <label style={labelStyle}>Nombre *</label>
          <input value={form.nombre} onChange={set('nombre')} placeholder="Ej. TechKing S.A." style={inputStyle} />
        </div>

        <div style={row}>
          <div style={field}>
            <label style={labelStyle}>Contacto *</label>
            <input value={form.contacto} onChange={set('contacto')} placeholder="Nombre del contacto" style={inputStyle} />
          </div>
          <div style={field}>
            <label style={labelStyle}>Teléfono * <span style={{ color: 'var(--muted)', fontWeight: 400, textTransform: 'none' }}>(8 dígitos)</span></label>
            <input
              value={form.telefono}
              onChange={handleTelefono}
              placeholder="22221111"
              inputMode="numeric"
              maxLength={8}
              style={{ ...inputStyle, letterSpacing: form.telefono.length > 0 ? 1 : 0 }}
            />
          </div>
        </div>

        <div style={row}>
          <div style={field}>
            <label style={labelStyle}>Correo</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="correo@empresa.com" style={inputStyle} />
          </div>
          <div style={field}>
            <label style={labelStyle}>Tipo *</label>
            <select value={form.tipo} onChange={set('tipo')} style={inputStyle}>
              <option value="">Seleccionar...</option>
              <option value="Nacional">Nacional</option>
              <option value="Internacional">Internacional</option>
              <option value="Distribuidor">Distribuidor</option>
              <option value="Fabricante">Fabricante</option>
            </select>
          </div>
        </div>

        <div style={field}>
          <label style={labelStyle}>País *</label>
          <input 
            value={form.pais} 
            onChange={set('pais')} 
            placeholder={form.tipo === 'Nacional' ? 'El Salvador' : 'Ej. Estados Unidos'} 
            style={inputStyle} 
            disabled={form.tipo === 'Nacional'} 
          />
        </div>

        {form.tipo === 'Nacional' && (
          <div style={row}>
            <div style={field}>
              <label style={labelStyle}>Departamento *</label>
              <select value={deptoSel} onChange={handleDepto} style={inputStyle}>
                <option value="">Seleccionar...</option>
                {departamentos.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
            </div>
            <div style={field}>
              <label style={labelStyle}>Municipio *</label>
              <select value={form.id_municipio} onChange={set('id_municipio')} style={inputStyle} disabled={!deptoSel}>
                <option value="">Seleccionar...</option>
                {municipios.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        )}

      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '1px solid var(--border)', background: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>Cancelar</button>
        <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}

export default function Proveedores() {
  const { tienePermiso } = useAuth(); // <-- Inyectamos el control de acceso global
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch]           = useState('');
  const [tab, setTab]                 = useState('todos');
  const [modal, setModal]             = useState(null);
  const [selected, setSelected]       = useState(null);
  const [loading, setLoading]         = useState(true);

  const fetchAll = async () => {
    try {
      const { data } = await api.get('/proveedores');
      setProveedores(data.data || data);
    } catch {
      toast.error('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtrados = proveedores.filter(p => {
    const matchTab =
      tab === 'todos'     ? true :
      tab === 'activos'   ? p.estado === 1 :
      tab === 'inactivos' ? p.estado === 0 : true;
    const q = search.toLowerCase();
    const matchSearch =
      p.nombre?.toLowerCase().includes(q)   ||
      p.contacto?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)    ||
      p.telefono?.includes(q);
    return matchTab && matchSearch;
  });

  const total     = proveedores.length;
  const activos   = proveedores.filter(p => p.estado === 1).length;
  const inactivos = proveedores.filter(p => p.estado === 0).length;

  const toggleEstado = async (p) => {
    await api.put(`/proveedores/${p.id}`, { estado: p.estado === 1 ? 0 : 1 });
    toast.success(p.estado === 1 ? 'Proveedor desactivado' : 'Proveedor activado');
    fetchAll();
  };

  const onSave = () => { setModal(null); setSelected(null); fetchAll(); };

  const initials = (nombre = '') =>
    nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const avatarColor = (nombre = '') => {
    const colors     = ['#e8f0fe','#e6f4ea','#fce8e6','#fef9e7','#f3e5f5','#e0f7fa'];
    const textColors = ['#3b6fd4','#1e8449','#c0392b','#b7950b','#7d3c98','#00838f'];
    const i = (nombre.charCodeAt(0) || 0) % colors.length;
    return { bg: colors[i], color: textColors[i] };
  };

  const btnStyle = (active) => ({
    padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', border: 'none', fontFamily: 'inherit',
    background: active ? '#fff' : 'none',
    color: active ? 'var(--text)' : 'var(--muted)',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Total',     value: total,     color: '#2563eb', icon: Layers      },
          { label: 'Activos',   value: activos,   color: '#059669', icon: CheckCircle },
          { label: 'Inactivos', value: inactivos, color: '#dc2626', icon: XCircle     },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar proveedor..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
          {[["todos","Todos"], ["activos","Activos"], ["inactivos","Inactivos"]].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={btnStyle(tab === val)}>{label}</button>
          ))}
        </div>

        {/* CONTROL: Solo perfiles con el permiso asignado ven el botón para crear */}
        {tienePermiso('ver-proveedores') && (
          <button
            onClick={() => { setSelected(null); setModal('form'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Nuevo proveedor
          </button>
        )}
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Lista de proveedores</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', background: '#f4f6f9', padding: '4px 10px', borderRadius: 20 }}>{filtrados.length} proveedores</span>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Cargando...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Proveedor', 'Contacto', 'Teléfono', 'Correo', 'Tipo', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, padding: '10px 20px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => {
                const av = avatarColor(p.nombre);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: av.bg, color: av.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {initials(p.nombre)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{p.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <Building2 size={13} color="var(--muted)" />
                        {p.contacto}
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                        <Phone size={13} color="var(--muted)" />
                        {p.telefono}
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: p.email ? 'var(--accent)' : 'var(--muted)' }}>
                        <Mail size={13} color="var(--muted)" />
                        {p.email || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      {p.tipo
                        ? <span style={{ background: '#f0f2f5', color: '#6b7280', fontSize: 11, padding: '2px 8px', borderRadius: 5 }}>{p.tipo}</span>
                        : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
                      }
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                        background: p.estado === 1 ? '#f0fdf4' : '#f1f5f9',
                        color: p.estado === 1 ? 'var(--success)' : 'var(--muted)'
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                        {p.estado === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {/* El botón de ver detalle se queda público para cualquiera que pueda ver el módulo */}
                        <button onClick={() => { setSelected(p); setModal('view'); }} title="Ver Detalle"
                          style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Eye size={13} color="var(--accent)" />
                        </button>

                        {/* CONTROL: Oculta la edición según privilegios de Spatie */}
                        {tienePermiso('ver-proveedores') && (
                          <button onClick={() => { setSelected(p); setModal('form'); }} title="Editar"
                            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Pencil size={13} color="var(--muted)" />
                          </button>
                        )}

                        {/* CONTROL: Oculta la desactivación de registros */}
                        {tienePermiso('ver-proveedores') && (
                          <button onClick={() => toggleEstado(p)} title={p.estado === 1 ? 'Desactivar' : 'Activar'}
                            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PowerOff size={13} color={p.estado === 1 ? 'var(--danger)' : 'var(--success)'} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                    No se encontraron proveedores
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* RENDERIZADO DE MODALES */}
      {modal === 'form' && (
        <Modal title={selected ? `Editar: ${selected.nombre}` : 'Nuevo proveedor'} onClose={() => setModal(null)}>
          <ProveedorForm inicial={selected} onSave={onSave} onClose={() => setModal(null)} />
        </Modal>
      )}

      {modal === 'view' && selected && (
        <Modal title="Información del Proveedor" onClose={() => { setModal(null); setSelected(null); }}>
          <ProveedorDetalle proveedor={selected} onClose={() => { setModal(null); setSelected(null); }} />
        </Modal>
      )}

    </div>
  );
}