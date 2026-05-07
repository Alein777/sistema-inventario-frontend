import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, Tag, Truck,
  ArrowLeftRight, Users, LogOut
} from 'lucide-react';

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/productos',   icon: Package,         label: 'Productos' },
  { to: '/categorias',  icon: Tag,             label: 'Categorías' },
  { to: '/proveedores', icon: Truck,           label: 'Proveedores' },
  { to: '/movimientos', icon: ArrowLeftRight,  label: 'Movimientos' },
  { to: '/usuarios',    icon: Users,           label: 'Usuarios' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      width: 240, background: 'var(--navy)', display: 'flex',
      flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: 'var(--accent)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Package size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>GDA Store</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Inventario</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, padding: '12px 8px 6px' }}>Principal</div>
        {navItems.slice(0,1).map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
            fontSize: 13.5, fontWeight: 500,
            background: isActive ? 'var(--accent)' : 'transparent',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
            boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.4)' : 'none',
          })}>
            <Icon size={16} />{label}
          </NavLink>
        ))}

        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, padding: '12px 8px 6px' }}>Inventario</div>
        {navItems.slice(1,5).map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
            fontSize: 13.5, fontWeight: 500,
            background: isActive ? 'var(--accent)' : 'transparent',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
            boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.4)' : 'none',
          })}>
            <Icon size={16} />{label}
          </NavLink>
        ))}

        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, padding: '12px 8px 6px' }}>Administración</div>
        {navItems.slice(5).map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
            fontSize: 13.5, fontWeight: 500,
            background: isActive ? 'var(--accent)' : 'transparent',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
            boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.4)' : 'none',
          })}>
            <Icon size={16} />{label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: '#1e3a6e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#3b82f6', flexShrink: 0
        }}>
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{user?.roles?.[0]}</div>
        </div>
        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4 }}>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}