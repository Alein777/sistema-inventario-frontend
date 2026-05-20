import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, Package, User, Calendar, TrendingUp, TrendingDown, Plus, Eye, ArrowLeftRight } from 'lucide-react';
import ActionButton from '../components/ActionButton';

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [productoFilter, setProductoFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movimientosPerPage] = useState(10);

  const fetchAll = async (page = 1) => {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([
        api.get(`/movimientos?page=${page}&per_page=${movimientosPerPage}`),
        api.get('/productos'),
      ]);
      setMovimientos(m.data.data || []);
      setProductos(p.data.data || []);
      setTotalPages(m.data.last_page || 1);
      setCurrentPage(m.data.current_page || 1);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAll(page);
  };

  useEffect(() => { fetchAll(); }, [movimientosPerPage]);

  const filtered = movimientos.filter(m => {
    if (search && !m.producto?.nombre.toLowerCase().includes(search.toLowerCase()) && 
        !m.user?.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tipoFilter && m.tipo !== tipoFilter) return false;
    if (productoFilter && m.id_producto !== Number(productoFilter)) return false;
    return true;
  });

  const getTipoIcon = (tipo) => tipo === 'entrada' ? ArrowDownLeft : ArrowUpRight;
  const getTipoColor = (tipo) => tipo === 'entrada' ? '#059669' : '#dc2626';

  const stats = {
    total: movimientos.length,
    entradas: movimientos.filter(m => m.tipo === 'entrada').length,
    salidas: movimientos.filter(m => m.tipo === 'salida').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.total}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Total movimientos</div>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownLeft size={18} color="#059669" />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.entradas}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Entradas</div>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={18} color="#dc2626" />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.salidas}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Salidas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por producto o usuario..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        </div>
        <select value={tipoFilter} onChange={e => setTipoFilter(e.target.value)}
          style={{ padding: '9px 28px 9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', appearance: 'none', background: '#fff' }}>
          <option value="">Todos los tipos</option>
          <option value="entrada">Entradas</option>
          <option value="salida">Salidas</option>
        </select>
        <select value={productoFilter} onChange={e => setProductoFilter(e.target.value)}
          style={{ padding: '9px 28px 9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', appearance: 'none', background: '#fff' }}>
          <option value="">Todos los productos</option>
          {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </div>

      {/* Movements Table */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Fecha</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Producto</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Tipo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cantidad</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Stock Cambio</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Usuario</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                    Cargando movimientos...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                    No se encontraron movimientos
                  </td>
                </tr>
              ) : (
                filtered.map(m => {
                  const Icon = getTipoIcon(m.tipo);
                  const color = getTipoColor(m.tipo);
                  return (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                          {new Date(m.created_at).toLocaleDateString('es-ES')}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                          {new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 6, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={14} color="#64748b" />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{m.producto?.nombre}</div>
                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>ID: {m.id_producto}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ 
                            width: 28, height: 28, borderRadius: 6, 
                            background: color + '20', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                          }}>
                            <Icon size={14} color={color} />
                          </div>
                          <span style={{ 
                            fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 12, 
                            background: color + '20', color, textTransform: 'capitalize' 
                          }}>
                            {m.tipo}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{m.cantidad}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: 12 }}>
                          <div style={{ color: '#64748b' }}>Antes: <strong>{m.stock_anterior}</strong></div>
                          <div style={{ color: color }}>Ahora: <strong>{m.stock_nuevo}</strong></div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={14} color="#64748b" />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{m.user?.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{m.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {m.motivo || 'Sin motivo especificado'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}