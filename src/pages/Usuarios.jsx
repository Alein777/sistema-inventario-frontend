import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, PowerOff, Users, UserCheck, UserX } from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 14, width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ width: 30, height: 30, border: 'none', background: '#f4f6f9', borderRadius: 6, cursor: 'pointer', fontSize: 16, color: 'var(--muted)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function UsuarioForm({ inicial, onSave, onClose }) {
  const esEdicion = !!inicial?.id;
  const [form, setForm] = useState({
    name:     inicial?.name     || '',
    email:    inicial?.email    || '',
    password: '',
    rol:      inicial?.roles?.[0] || 'Empleado',
    estado:   inicial?.estado   ?? 1,
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (esEdicion && !payload.password) delete payload.password;

      if (esEdicion) {
        await api.put(`/usuarios/${inicial.id}`, payload);
        toast.success('Usuario actualizado');
      } else {
        await api.post('/usuarios', payload);
        toast.success('Usuario creado');
      }
      onSave();
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data?.errors || {})[0]?.[0]
        || 'Error al guardar';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const input = (label, key, type = 'text', placeholder = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
        style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {input('Nombre completo', 'name', 'text', 'Ej. María González')}
        {input('Correo electrónico', 'email', 'email', 'correo@ejemplo.com')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {esEdicion ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
          </label>
          <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
            placeholder={esEdicion ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
            style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Rol</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['Administrador', 'Empleado'].map(r => (
              <button key={r} type="button" onClick={() => set('rol', r)} style={{
                padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${form.rol === r ? 'var(--accent)' : 'var(--border)'}`,
                background: form.rol === r ? '#eff6ff' : 'none',
                color: form.rol === r ? 'var(--accent)' : 'var(--muted)'
              }}>{r}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '1px solid var(--border)', background: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>Cancelar</button>
        <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState('todos');
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchAll = async () => {
    const { data } = await api.get('/usuarios');
    setUsuarios(data.data || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = usuarios.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'activos')   return u.estado === 1;
    if (tab === 'inactivos') return u.estado === 0;
    return true;
  });

  const toggleEstado = async (u) => {
    await api.put(`/usuarios/${u.id}`, { estado: u.estado === 1 ? 0 : 1 });
    toast.success(u.estado === 1 ? 'Usuario desactivado' : 'Usuario activado');
    fetchAll();
  };

  const btnStyle = (active) => ({
    padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', border: 'none', fontFamily: 'inherit',
    background: active ? '#fff' : 'none',
    color: active ? 'var(--text)' : 'var(--muted)',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
  });

  const initials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  const rolColor = (rol) => rol === 'Administrador'
    ? { bg: '#eff6ff', color: '#2563eb' }
    : { bg: '#f0fdf4', color: '#059669' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Total usuarios', value: usuarios.length,                             color: '#2563eb', icon: Users      },
          { label: 'Activos',        value: usuarios.filter(u => u.estado === 1).length, color: '#059669', icon: UserCheck  },
          { label: 'Inactivos',      value: usuarios.filter(u => u.estado === 0).length, color: '#dc2626', icon: UserX      },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
          {['todos', 'activos', 'inactivos'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={btnStyle(tab === t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => { setSelected(null); setModal('form'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> Nuevo usuario
        </button>
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Lista de usuarios</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', background: '#f4f6f9', padding: '4px 10px', borderRadius: 20 }}>{filtered.length} usuarios</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Usuario', 'Email', 'Rol', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, padding: '10px 20px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const rc = rolColor(u.roles?.[0]);
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                        {initials(u.name)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: 13, color: 'var(--muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: rc.bg, color: rc.color }}>
                      {u.roles?.[0] || 'Sin rol'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                      background: u.estado === 1 ? '#f0fdf4' : '#f1f5f9',
                      color: u.estado === 1 ? 'var(--success)' : 'var(--muted)'
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                      {u.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setSelected(u); setModal('form'); }} title="Editar"
                        style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pencil size={13} color="var(--muted)" />
                      </button>
                      <button onClick={() => toggleEstado(u)} title={u.estado === 1 ? 'Desactivar' : 'Activar'}
                        style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PowerOff size={13} color={u.estado === 1 ? 'var(--danger)' : 'var(--success)'} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal === 'form' && (
        <Modal title={selected ? `Editar: ${selected.name}` : 'Nuevo usuario'} onClose={() => setModal(null)}>
          <UsuarioForm inicial={selected} onSave={() => { setModal(null); fetchAll(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}