import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Shield, Check, X, ShieldCheck, Lock } from 'lucide-react';

const GRUPOS_PERMISOS = {
  "General": ["ver-dashboard"],
  "Productos": ["ver-productos", "crear-productos", "editar-productos", "desactivar-productos", "ajustar-stock"],
  "Categorías": ["ver-categorias"],
  "Proveedores": ["ver-proveedores"],
  "Movimientos": ["ver-movimientos"],
  "Administración": ["gestionar-usuarios"]
};

function Modal({ title, onClose, children }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110 }}>
      <div style={{ background: '#fff', borderRadius: 14, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--muted)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [rolActivo, setRolActivo] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditarNombre, setModalEditarNombre] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados de formularios
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [permisosEditados, setPermisosEditados] = useState([]);

  const fetchRoles = async (seleccionarId = null) => {
    try {
      const { data } = await api.get('/roles');
      const listaRoles = data.roles || [];
      setRoles(listaRoles);
      
      if (listaRoles.length > 0) {
        // Mantiene seleccionado el rol actual o el primero por defecto
        const encontrado = listaRoles.find(r => r.id === seleccionarId) || listaRoles[0];
        setRolActivo(encontrado);
        setPermisosEditados(encontrado.permissions.map(p => p.name));
      }
    } catch {
      toast.error('Error al cargar los perfiles de seguridad');
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const seleccionarRol = (role) => {
    setRolActivo(role);
    setPermisosEditados(role.permissions.map(p => p.name));
  };

  const handleCheckboxChange = (permName) => {
    if (rolActivo?.name === 'Administrador') return; // Bloqueo estricto al Admin
    setPermisosEditados(prev =>
      prev.includes(permName) ? prev.filter(p => p !== permName) : [...prev, permName]
    );
  };

  const handleGuardarPermisos = async () => {
    if (!rolActivo) return;
    setLoading(true);
    try {
      await api.put(`/roles/${rolActivo.id}`, { 
        name: rolActivo.name, 
        permissions: permisosEditados 
      });
      toast.success('Matriz de permisos actualizada');
      fetchRoles(rolActivo.id);
    } catch {
      toast.error('Error al guardar cambios');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearRol = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return toast.error('Escribe un nombre válido');
    try {
      const { data } = await api.post('/roles', { name: nuevoNombre, permissions: ['ver-dashboard'] });
      toast.success('Nuevo perfil creado');
      setModalNuevo(false);
      setNuevoNombre('');
      fetchRoles(data.role?.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear');
    }
  };

  const handleActualizarNombre = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return toast.error('Escribe un nombre válido');
    try {
      await api.put(`/roles/${rolActivo.id}`, { name: nuevoNombre, permissions: permisosEditados });
      toast.success('Nombre del rol modificado');
      setModalEditarNombre(false);
      setNuevoNombre('');
      fetchRoles(rolActivo.id);
    } catch {
      toast.error('Error al actualizar nombre');
    }
  };

  const esAdminPrincipal = rolActivo?.name === 'Administrador';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 110px)' }}>
      
      {/* Encabezado Superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Roles y Permisos</h2>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>Configura los perfiles de acceso y restricciones para tus empleados en tiempo real.</p>
        </div>
        <button onClick={() => setModalNuevo(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> Nuevo Rol
        </button>
      </div>

      {/* Distribución de Pantalla Asimétrica (Adiós espacio en blanco) */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        
        {/* Columna Izquierda: Lista de Roles */}
        <div style={{ width: 310, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', background: '#f8fafc' }}>
            Perfiles Disponibles
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {roles.map(role => {
              const activo = rolActivo?.id === role.id;
              return (
                <div key={role.id} onClick={() => seleccionarRol(role)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                  background: activo ? '#f0f4ff' : 'transparent',
                  border: activo ? '1.5px solid var(--accent)' : '1.5px solid transparent'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <Shield size={16} color={activo ? 'var(--accent)' : '#94a3b8'} style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: activo ? 'var(--accent)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{role.permissions?.length || 0} accesos</div>
                    </div>
                  </div>
                  {activo && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Matriz de Control de Permisos */}
        <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {rolActivo ? (
            <>
              {/* Header de la Matriz */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={18} color="var(--success)" />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Matriz de Permisos: {rolActivo.name}</span>
                    {esAdminPrincipal && <span style={{ marginLeft: 8, fontSize: 10, background: '#fee2e2', color: '#ef4444', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>Protegido</span>}
                  </div>
                </div>
                {!esAdminPrincipal && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setNuevoNombre(rolActivo.name); setModalEditarNombre(true); }} style={{ padding: '6px 12px', border: '1px solid var(--border)', background: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cambiar Nombre</button>
                    <button onClick={handleGuardarPermisos} disabled={loading} style={{ padding: '6px 12px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {loading ? 'Sincronizando...' : 'Actualizar Matriz'}
                    </button>
                  </div>
                )}
              </div>

              {/* Matriz Detallada Modular */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, position: 'relative' }}>
                {esAdminPrincipal && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)', zIndex: 5, backdropFilter: 'blur(0.5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, color: 'var(--muted)' }}>
                    <Lock size={20} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>El Súper Administrador tiene control global no modificable.</span>
                  </div>
                )}

                {Object.entries(GRUPOS_PERMISOS).map(([modulo, perms]) => (
                  <div key={modulo} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>{modulo}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {perms.map(pName => {
                        const check = permisosEditados.includes(pName);
                        return (
                          <label key={pName} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, cursor: esAdminPrincipal ? 'default' : 'pointer', color: check ? 'var(--text)' : 'var(--muted)' }}>
                            <input type="checkbox" checked={check} onChange={() => handleCheckboxChange(pName)} disabled={esAdminPrincipal} style={{ width: 15, height: 15, cursor: esAdminPrincipal ? 'default' : 'pointer', accentColor: 'var(--accent)' }} />
                            <span style={{ textTransform: 'capitalize' }}>{pName.replace(/-/g, ' ')}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>Selecciona o crea un rol en el panel izquierdo</div>
          )}
        </div>
      </div>

      {/* MODAL: Nuevo Rol */}
      {modalNuevo && (
        <Modal title="Crear Perfil de Acceso" onClose={() => setModalNuevo(false)}>
          <form onSubmit={handleCrearRol} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>Nombre del Rol *</label>
              <input value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} placeholder="Ej. Encargado de Despachos" style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} required />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" onClick={() => setModalNuevo(false)} style={{ padding: '8px 14px', border: '1px solid var(--border)', background: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Crear Rol</button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: Cambiar Nombre */}
      {modalEditarNombre && (
        <Modal title="Renombrar Perfil" onClose={() => setModalEditarNombre(false)}>
          <form onSubmit={handleActualizarNombre} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>Nombre Actualizado *</label>
              <input value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} required />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" onClick={() => setModalEditarNombre(false)} style={{ padding: '8px 14px', border: '1px solid var(--border)', background: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cambiar Nombre</button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}