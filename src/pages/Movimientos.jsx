import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, ArrowUpCircle, ArrowDownCircle, Filter } from 'lucide-react';

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    api.get('/movimientos').then(({ data }) => {
      setMovimientos(data.data || []);
    });
  }, []);

  useEffect(() => {
    let result = [...movimientos];
    if (search) result = result.filter(m =>
      m.producto?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      m.motivo?.toLowerCase().includes(search.toLowerCase())
    );
    if (tipoFilter) result = result.filter(m => m.tipo === tipoFilter);
    if (fechaDesde) result = result.filter(m => m.created_at >= fechaDesde);
    if (fechaHasta) result = result.filter(m => m.created_at <= fechaHasta + 'T23:59:59');
    setFiltered(result);
    setPage(1);
  }, [movimientos, search, tipoFilter, fechaDesde, fechaHasta]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const entradas = movimientos.filter(m => m.tipo === 'entrada').length;
  const salidas  = movimientos.filter(m => m.tipo === 'salida').length;

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
          { label: 'Total movimientos', value: movimientos.length, color: '#2563eb', icon: Filter },
          { label: 'Entradas',          value: entradas,           color: '#059669', icon: ArrowUpCircle },
          { label: 'Salidas',           value: salidas,            color: '#dc2626', icon: ArrowDownCircle },
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
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto o motivo..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
          {[['', 'Todos'], ['entrada', 'Entradas'], ['salida', 'Salidas']].map(([val, label]) => (
            <button key={val} onClick={() => setTipoFilter(val)} style={btnStyle(tipoFilter === val)}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Desde</label>
          <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Hasta</label>
          <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, outline: 'none' }} />
        </div>
        {(search || tipoFilter || fechaDesde || fechaHasta) && (
          <button onClick={() => { setSearch(''); setTipoFilter(''); setFechaDesde(''); setFechaHasta(''); }}
            style={{ padding: '8px 14px', border: '1px solid var(--border)', background: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--muted)', alignSelf: 'flex-end' }}>
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Historial de movimientos</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', background: '#f4f6f9', padding: '4px 10px', borderRadius: 20 }}>{filtered.length} registros</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                {['#', 'Producto', 'Tipo', 'Cantidad', 'Stock', 'Motivo', 'Usuario', 'Fecha'].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, padding: '10px 16px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--muted)' }}>#{m.id}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 600, maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.producto?.nombre || '—'}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                      background: m.tipo === 'entrada' ? '#f0fdf4' : '#fef2f2',
                      color: m.tipo === 'entrada' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                      {m.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 700, color: m.tipo === 'entrada' ? 'var(--success)' : 'var(--danger)' }}>
                    {m.tipo === 'entrada' ? '+' : '−'}{m.cantidad}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <span style={{ color: 'var(--muted)' }}>{m.stock_anterior}</span>
                      <span style={{ color: 'var(--muted)' }}>→</span>
                      <span style={{ fontWeight: 700, color: m.tipo === 'entrada' ? 'var(--success)' : 'var(--danger)' }}>{m.stock_nuevo}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--muted)', maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.motivo || '—'}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                        {m.user?.name?.charAt(0) || 'S'}
                      </div>
                      <span style={{ color: 'var(--muted)' }}>{m.user?.name || 'Sistema'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {m.created_at ? new Date(m.created_at).toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                    No se encontraron movimientos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
          <span>Mostrando {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: 30, height: 30, border: '1px solid var(--border)', background: 'none', borderRadius: 6, cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#cbd5e1' : 'var(--muted)', fontSize: 14 }}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                style={{ width: 30, height: 30, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', background: page === n ? 'var(--accent)' : 'none', color: page === n ? '#fff' : 'var(--muted)', borderColor: page === n ? 'var(--accent)' : 'var(--border)' }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: 30, height: 30, border: '1px solid var(--border)', background: 'none', borderRadius: 6, cursor: page === totalPages ? 'default' : 'pointer', color: page === totalPages ? '#cbd5e1' : 'var(--muted)', fontSize: 14 }}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}