import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, PowerOff, Tag, Layers, CheckCircle, XCircle } from 'lucide-react';
import ActionButton from '../components/ActionButton';

function Modal({ title, onClose, children }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 14, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ width: 30, height: 30, border: 'none', background: '#f4f6f9', borderRadius: 6, cursor: 'pointer', fontSize: 16, color: 'var(--muted)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CategoriaForm({ inicial, onSave, onClose }) {
  const [nombre, setNombre] = useState(inicial?.nombre || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) { toast.error('Ingresa un nombre'); return; }
    setLoading(true);
    try {
      if (inicial?.id) {
        await api.put(`/categorias/${inicial.id}`, { nombre, estado: inicial.estado });
        toast.success('Categoría actualizada');
      } else {
        await api.post('/categorias', { nombre, estado: 1 });
        toast.success('Categoría creada');
      }
      onSave();
    } catch {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Nombre</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Electrónica"
            style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
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

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoriasPerPage] = useState(10);

  const fetchAll = async (page = 1) => {
    try {
      const { data } = await api.get(`/categorias?page=${page}&per_page=${categoriasPerPage}`);
      setCategorias(data.data || []);
      setTotalPages(data.last_page || 1);
      setCurrentPage(data.current_page || 1);
    } catch (err) {
      console.error('Error fetching categorias:', err);
      toast.error('Error al cargar categorías');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAll(page);
  };

  useEffect(() => { fetchAll(); }, [categoriasPerPage]);

  const filtered = categorias.filter(c => {
    if (search && !c.nombre.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'activas') return c.estado === 1;
    if (tab === 'inactivas') return c.estado === 0;
    return true;
  });

  const toggleEstado = async (c) => {
    await api.put(`/categorias/${c.id}`, { estado: c.estado === 1 ? 0 : 1 });
    toast.success(c.estado === 1 ? 'Categoría desactivada' : 'Categoría activada');
    fetchAll();
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
          { label: 'Total',     value: categorias.length,                             color: '#2563eb', icon: Layers      },
          { label: 'Activas',   value: categorias.filter(c => c.estado === 1).length, color: '#059669', icon: CheckCircle },
          { label: 'Inactivas', value: categorias.filter(c => c.estado === 0).length, color: '#dc2626', icon: XCircle     },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar categoría..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
          {['todas', 'activas', 'inactivas'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={btnStyle(tab === t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => { setSelected(null); setModal('form'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> Nueva categoría
        </button>
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Lista de categorías</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', background: '#f4f6f9', padding: '4px 10px', borderRadius: 20 }}>{filtered.length} categorías</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Categoría', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, padding: '10px 20px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Tag size={16} color="var(--accent)" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.nombre}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                    background: c.estado === 1 ? '#f0fdf4' : '#f1f5f9',
                    color: c.estado === 1 ? 'var(--success)' : 'var(--muted)'
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                    {c.estado === 1 ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <ActionButton
                        icon={Pencil}
                        title="Editar"
                        onClick={() => { setSelected(c); setModal('form'); }}
                        color="#f59e0b"
                      />
                    <ActionButton
                        icon={PowerOff}
                        title={c.estado === 1 ? 'Desactivar' : 'Activar'}
                        onClick={() => toggleEstado(c)}
                        danger={c.estado === 1}
                      />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  No se encontraron categorías
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
        <Modal title={selected ? `Editar: ${selected.nombre}` : 'Agregar categoria'} onClose={() => setModal(null)}>
          <CategoriaForm inicial={selected} onSave={() => { setModal(null); fetchAll(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}