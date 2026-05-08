import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Search, Eye, Pencil, ArrowLeftRight, PowerOff, Package } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

const estadoColor = { ok: '#059669', low: '#d97706', critical: '#dc2626' };
const estadoLabel = { ok: 'En stock', low: 'Stock bajo', critical: 'Sin stock' };

function getEstado(stock, minimo) {
  if (stock === 0) return 'critical';
  if (stock <= minimo) return 'low';
  return 'ok';
}

function Modal({ title, onClose, children }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 14, width: 520, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ width: 30, height: 30, border: 'none', background: '#f4f6f9', borderRadius: 6, cursor: 'pointer', fontSize: 16, color: 'var(--muted)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProductoForm({ inicial, categorias, proveedores, onSave, onClose }) {
  const esEdicion = !!inicial?.id;
  const [form, setForm] = useState({
    nombre:        inicial?.nombre || '',
    detalle:       inicial?.detalle || '',
    precio_compra: inicial?.precio_compra || '',
    precio_venta:  inicial?.precio_venta || '',
    stock:         inicial?.stock || '',
    stock_minimo:  inicial?.stock_minimo || 5,
    id_categoria:  inicial?.id_categoria || '',
    id_proveedor:  inicial?.id_proveedor || '',
    estado:        inicial?.estado ?? 1,
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [eliminarImagen, setEliminarImagen] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const payload = { ...form };
      // Al editar no enviamos stock — solo se cambia via ajuste
      if (esEdicion) delete payload.stock;

      if (esEdicion) {
        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== null && v !== undefined) formData.append(k, v);
        });
        await api.post(`/productos/${inicial.id}`, formData);
        toast.success('Producto actualizado');
      } else {
        await api.post('/productos', payload);

        toast.success('Producto creado');
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
        {}
        <ImageUploader
          imagenActualUrl={inicial?.imagen_url}
          onImageChange={(file) => {
            setImagenFile(file);
            if (file) setEliminarImagen(false);
          }}
          onImageRemove={() => {
            setImagenFile(null);
            setEliminarImagen(true);
          }}
        />

        {input('Nombre', 'nombre', 'text', 'Ej. Laptop HP 15s')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Detalle</label>
          <textarea value={form.detalle} onChange={e => set('detalle', e.target.value)} placeholder="Descripción del producto..."
            style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', resize: 'none', height: 70 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {input('Precio compra ($)', 'precio_compra', 'number', '0.00')}
          {input('Precio venta ($)', 'precio_venta', 'number', '0.00')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Solo mostrar stock al crear, no al editar */}
          {!esEdicion && input('Stock inicial', 'stock', 'number', '0')}
          {input('Stock mínimo', 'stock_minimo', 'number', '5')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Categoría</label>
            <select value={form.id_categoria} onChange={e => set('id_categoria', e.target.value)}
              style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }}>
              <option value="">Seleccionar</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Proveedor</label>
            <select value={form.id_proveedor} onChange={e => set('id_proveedor', e.target.value)}
              style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }}>
              <option value="">Seleccionar</option>
              {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
        </div>
        {esEdicion && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#92400e' }}>
            💡 Para modificar el stock usa el botón <strong>Ajustar stock</strong> en la tarjeta del producto.
          </div>
        )}
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

function AjusteModal({ producto, onSave, onClose }) {
  const [form, setForm] = useState({ tipo: 'entrada', cantidad: 1, motivo: 'Compra a proveedor' });
  const [loading, setLoading] = useState(false);
  const motivos = ['Compra a proveedor', 'Ajuste de inventario', 'Producto dañado', 'Devolución', 'Conteo físico'];

  const stockNuevo = form.tipo === 'entrada'
    ? producto.stock + Number(form.cantidad)
    : Math.max(0, producto.stock - Number(form.cantidad));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/movimientos', { id_producto: producto.id, ...form });
      toast.success('Stock ajustado correctamente');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al ajustar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{producto.nombre}</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Stock actual: <strong>{producto.stock}</strong></span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['entrada', 'salida'].map(t => (
            <button type="button" key={t} onClick={() => setForm(f => ({ ...f, tipo: t }))}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: form.tipo === t ? `2px solid ${t === 'entrada' ? 'var(--success)' : 'var(--danger)'}` : '1px solid var(--border)',
                background: form.tipo === t ? (t === 'entrada' ? '#ecfdf5' : '#fef2f2') : '#fff',
                color: form.tipo === t ? (t === 'entrada' ? 'var(--success)' : 'var(--danger)') : 'var(--muted)',
                textTransform: 'capitalize'
              }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cantidad</label>
          <input type="number" min="1" value={form.cantidad} onChange={e => setForm(f => ({ ...f, cantidad: e.target.value }))}
            style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Motivo</label>
          <select value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))}
            style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }}>
            {motivos.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 10, fontSize: 12, color: '#0369a1' }}>
          Stock resultante: <strong>{stockNuevo} unidades</strong>
        </div>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', border: '1px solid var(--border)', background: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--muted)' }}>Cancelar</button>
        <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Guardando...' : 'Guardar ajuste'}
        </button>
      </div>
    </form>
  );
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [tab, setTab] = useState('todos');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchAll = async () => {
    const [p, c, pr] = await Promise.all([
      api.get('/productos'),
      api.get('/categorias'),
      api.get('/proveedores'),
    ]);
    setProductos(p.data.data || []);
    setCategorias(c.data.data || []);
    setProveedores(pr.data.data || []);
  };

  // eslint-disable-next-line
  useEffect(() => { fetchAll(); }, []);

  const filtered = productos.filter(p => {
    if (search && !p.nombre.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && p.id_categoria !== Number(catFilter)) return false;
    if (tab === 'bajo') return getEstado(p.stock, p.stock_minimo) !== 'ok';
    if (tab === 'inactivo') return p.estado === 0;
    return true;
  });

  const toggleEstado = async (p) => {
    const formData = new FormData();
    formData.append('estado', p.estado === 1 ? 0 : 1);
    await api.post(`/productos/${p.id}`, formData);
    toast.success(p.estado === 1 ? 'Producto desactivado' : 'Producto activado');
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
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ padding: '9px 28px 9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', appearance: 'none', background: '#fff' }}>
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
          {['todos', 'bajo', 'inactivo'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={btnStyle(tab === t)}>
              {t === 'todos' ? 'Todos' : t === 'bajo' ? 'Stock bajo' : 'Inactivos'}
            </button>
          ))}
        </div>
        <button onClick={() => { setSelected(null); setModal('form'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={14} /> Agregar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
        {filtered.map(p => {
          const est = p.estado === 0 ? 'inactive' : getEstado(p.stock, p.stock_minimo);
          const color = est === 'inactive' ? 'var(--muted)' : estadoColor[est];
          const pct = Math.min(100, Math.round((p.stock / Math.max(p.stock_minimo * 2, 1)) * 100));
          return (
            <div key={p.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', opacity: p.estado === 0 ? 0.6 : 1, transition: 'all 0.2s' }}>
+
              <div style={{ height: 110, background: 'linear-gradient(135deg, #f0f5ff, #e8f0fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {p.imagen
                  ? <img src={p.imagen} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Package size={32} color="#93afd4" />
                }

                <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: color + '20', color }}>
                  {est === 'inactive' ? 'Inactivo' : estadoLabel[est]}
                </span>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>{p.categoria?.nombre}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>${Number(p.precio_venta).toFixed(2)}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 8 }}>Compra: <strong>${Number(p.precio_compra).toFixed(2)}</strong></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
                  <span>{p.stock} uds</span>
                  <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 4 }} />
                  </div>
                  <span>mín {p.stock_minimo}</span>
                </div>
                <div style={{ display: 'flex', gap: 5, borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                  {[
                    { icon: Eye,           title: 'Ver',      action: () => { setSelected(p); setModal('ver'); } },
                    { icon: ArrowLeftRight,title: 'Ajustar',  action: () => { setSelected(p); setModal('ajuste'); } },
                    { icon: Pencil,        title: 'Editar',   action: () => { setSelected(p); setModal('form'); } },
                    { icon: PowerOff,      title: p.estado === 1 ? 'Desactivar' : 'Activar', action: () => toggleEstado(p), danger: true },
                  ].map(({ icon: Icon, title, action, danger }) => (
                    <button key={title} onClick={action} title={title} style={{
                      flex: 1, padding: 6, borderRadius: 6, border: '1px solid var(--border)',
                      background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Icon size={13} color={danger ? 'var(--danger)' : 'var(--muted)'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--muted)', fontSize: 13 }}>
            No se encontraron productos
          </div>
        )}
      </div>

      {modal === 'form' && (
        <Modal title={selected ? `Editar: ${selected.nombre}` : 'Agregar producto'} onClose={() => setModal(null)}>
          <ProductoForm inicial={selected} categorias={categorias} proveedores={proveedores}
            onSave={() => { setModal(null); fetchAll(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'ajuste' && selected && (
        <Modal title="Ajustar stock" onClose={() => setModal(null)}>
          <AjusteModal producto={selected} onSave={() => { setModal(null); fetchAll(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'ver' && selected && (
        <Modal title="Detalle del producto" onClose={() => setModal(null)}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {p?.imagen && (
              <img src={selected.imagen} alt={selected.nombre} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }} />

            )}
            {[
              ['Nombre',        selected.nombre],
              ['Detalle',       selected.detalle],
              ['Precio compra', `$${Number(selected.precio_compra).toFixed(2)}`],
              ['Precio venta',  `$${Number(selected.precio_venta).toFixed(2)}`],
              ['Stock',         selected.stock],
              ['Stock mínimo',  selected.stock_minimo],
              ['Categoría',     selected.categoria?.nombre],
              ['Proveedor',     selected.proveedor?.nombre],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', minWidth: 120 }}>{k}</span>
                <span style={{ fontSize: 13 }}>{v}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
