import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';

const titles = {
  '/':            { title: 'Dashboard',                  sub: 'Resumen general del inventario' },
  '/productos':   { title: 'Productos',                  sub: 'Gestión de productos' },
  '/categorias':  { title: 'Categorías',                 sub: 'Clasificación de productos' },
  '/proveedores': { title: 'Proveedores',                sub: 'Red de proveedores' },
  '/movimientos': { title: 'Movimientos',                sub: 'Historial de entradas y salidas' },
  '/usuarios':    { title: 'Usuarios',                   sub: 'Gestión de usuarios del sistema' },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { title, sub } = titles[pathname] || { title: 'GDA Store', sub: '' };
  const [alertas, setAlertas] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const { data } = await api.get('/productos');
        const bajos = (data.data || []).filter(p =>
          p.estado === 1 && p.stock <= p.stock_minimo
        );
        setAlertas(bajos);
      } catch {}
    };
    fetchAlertas();
    const interval = setInterval(fetchAlertas, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid var(--border)',
      padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      position: 'relative'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>
      </div>

      {/* Campana */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(o => !o)} style={{
          width: 36, height: 36, border: '1px solid var(--border)',
          background: '#fff', borderRadius: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative'
        }}>
          <Bell size={16} color={alertas.length > 0 ? 'var(--warning)' : 'var(--muted)'} />
          {alertas.length > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, background: '#ef4444',
              borderRadius: '50%', border: '2px solid #fff'
            }} />
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <>
            <div onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
            <div style={{
              position: 'absolute', top: 44, right: 0, width: 320,
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 100, overflow: 'hidden'
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Alertas de stock</span>
                {alertas.length > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#fef2f2', color: 'var(--danger)', padding: '2px 8px', borderRadius: 20 }}>
                    {alertas.length} productos
                  </span>
                )}
              </div>

              {alertas.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                   Inventario completo
                </div>
              ) : (
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {alertas.map(p => {
                    const critico = p.stock === 0;
                    return (
                      <div key={p.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px', borderBottom: '1px solid #f1f5f9'
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: critico ? '#fef2f2' : '#fffbeb',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <AlertTriangle size={14} color={critico ? 'var(--danger)' : 'var(--warning)'} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.categoria?.nombre}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: critico ? 'var(--danger)' : 'var(--warning)' }}>
                            {p.stock} uds
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--muted)' }}>mín {p.stock_minimo}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}