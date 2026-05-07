import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

const titles = {
  '/':            { title: 'Dashboard',          sub: 'Resumen general del inventario' },
  '/productos':   { title: 'Productos',           sub: 'Gestión de productos' },
  '/categorias':  { title: 'Categorías',          sub: 'Clasificación de productos' },
  '/proveedores': { title: 'Proveedores',         sub: 'Red de proveedores' },
  '/movimientos': { title: 'Movimientos',         sub: 'Historial de entradas y salidas' },
  '/usuarios':    { title: 'Usuarios',            sub: 'Gestión de usuarios del sistema' },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { title, sub } = titles[pathname] || { title: 'GDA Store', sub: '' };

  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid var(--border)',
      padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>
      </div>
      <button style={{
        width: 36, height: 36, border: '1px solid var(--border)',
        background: '#fff', borderRadius: 8, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Bell size={16} color="var(--muted)" />
      </button>
    </div>
  );
}