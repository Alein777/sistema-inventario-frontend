import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

import { Plus, Search, Eye, Pencil, Trash2, UserCheck, UserX, User, Mail, PowerOff } from 'lucide-react';
import ActionButton from '../components/ActionButton';


function Modal({ title, onClose, children }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>

      <div style={{ background: '#fff', borderRadius: 14, width: 480, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>

          <span style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ width: 30, height: 30, border: 'none', background: '#f4f6f9', borderRadius: 6, cursor: 'pointer', fontSize: 16, color: 'var(--muted)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}


function UsuarioForm({ inicial, roles, onSave, onClose }) {
  const esEdicion = !!inicial?.id;
  const [form, setForm] = useState({
    name: inicial?.name || '',
    email: inicial?.email || '',
    password: '',
    rol: inicial?.roles?.[0]?.name || '',
    estado: inicial?.estado ?? 1,
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

        {input('Nombre completo', 'name', 'text', 'Ej. Juan Pérez')}
        {input('Correo electrónico', 'email', 'email', 'ejemplo@correo.com')}
        {input('Contraseña', 'password', 'password', esEdicion ? 'Dejar en blanco para mantener' : 'Mínimo 6 caracteres')}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Rol</label>
          <select value={form.rol} onChange={e => set('rol', e.target.value)}
            style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }}>
            <option value="">Seleccionar rol</option>
            {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Estado</label>
          <select value={form.estado} onChange={e => set('estado', Number(e.target.value))}
            style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }}>
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end', position: 'sticky', bottom: 0, background: '#fff' }}>

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

  const [roles, setRoles] = useState([]);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usuariosPerPage] = useState(10);

  const fetchAll = async (page = 1) => {
    try {
      const [u, r] = await Promise.all([
        api.get(`/usuarios?page=${page}&per_page=${usuariosPerPage}`),
        api.get('/roles'),
      ]);
      setUsuarios(u.data.data || []);
      setRoles(r.data || []);
      setTotalPages(u.data.last_page || 1);
      setCurrentPage(u.data.current_page || 1);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Error al cargar datos');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAll(page);
  };

  useEffect(() => { fetchAll(); }, [usuariosPerPage]);

  const filtered = usuarios.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  const toggleEstado = async (u) => {

    try {
      await api.put(`/usuarios/${u.id}`, { estado: u.estado === 1 ? 0 : 1 });
      toast.success(u.estado === 1 ? 'Usuario desactivado' : 'Usuario activado');
      fetchAll();
    } catch (err) {
      toast.error('Error al cambiar estado');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': '#dc2626',
      'gerente': '#7c3aed',
      'empleado': '#2563eb',
    };
    return colors[role] || '#6b7280';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuario..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        </div>
        <button onClick={() => { setSelected(null); setModal('form'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> Agregar usuario
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Usuario</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Rol</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Estado</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="#64748b" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Mail size={12} /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, 
                      background: getRoleColor(u.roles?.[0]?.name) + '20', 
                      color: getRoleColor(u.roles?.[0]?.name) 
                    }}>
                      {u.roles?.[0]?.name || 'Sin rol'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, 
                      background: u.estado === 1 ? '#dcfce7' : '#fee2e2', 
                      color: u.estado === 1 ? '#166534' : '#dc2626' 
                    }}>
                      {u.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <ActionButton
                          icon={Eye}
                          title="Ver detalles"
                          onClick={() => { setSelected(u); setModal('ver'); }}
                          color="#64748b"
                        />
                        <ActionButton
                          icon={Pencil}
                          title="Editar"
                          onClick={() => { setSelected(u); setModal('form'); }}
                          color="#10b981"
                        />
                        <ActionButton
                          icon={PowerOff}
                          title={u.estado === 1 ? 'Desactivar' : 'Activar'}
                          onClick={() => toggleEstado(u)}
                          danger={u.estado === 1}
                        />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)', fontSize: 13 }}>
            No se encontraron usuarios
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 8, 
          marginTop: 16, 
          padding: '12px 20px',
          background: '#fff',
          borderRadius: 12,
          border: '1px solid var(--border)'
        }}>
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: currentPage === 1 ? '#f8fafc' : '#fff',
              color: currentPage === 1 ? 'var(--muted)' : 'var(--accent)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            Anterior
          </button>
          
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
            Página {currentPage} de {totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: currentPage === totalPages ? '#f8fafc' : '#fff',
              color: currentPage === totalPages ? 'var(--muted)' : 'var(--accent)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            Siguiente
          </button>
        </div>
      )}

      {modal === 'form' && (
        <Modal title={selected ? `Editar: ${selected.name}` : 'Agregar usuario'} onClose={() => setModal(null)}>
          <UsuarioForm inicial={selected} roles={roles}
            onSave={() => { setModal(null); fetchAll(); }} onClose={() => setModal(null)} />
        </Modal>
      )}

      {modal === 'ver' && selected && (
        <Modal title="Detalles del usuario" onClose={() => setModal(null)}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div style={{ width: 60, height: 60, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={28} color="#64748b" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{selected.email}</div>
              </div>
            </div>
            {[
              ['Rol', selected.roles?.[0]?.name || 'Sin rol'],
              ['Estado', selected.estado === 1 ? 'Activo' : 'Inactivo'],
              ['Creado el', new Date(selected.created_at).toLocaleDateString('es-ES')],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', minWidth: 100 }}>{k}</span>
                <span style={{ fontSize: 13 }}>{v}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}