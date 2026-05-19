import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, Tag, Truck,
  ArrowLeftRight, Users, LogOut, Shield
} from 'lucide-react';

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard',    group: 'principal', permission: 'ver-dashboard' },
  { to: '/productos',   icon: Package,         label: 'Productos',    group: 'inventario', permission: 'ver-productos' },
  { to: '/categorias',  icon: Tag,             label: 'Categorías',   group: 'inventario', permission: 'ver-categorias' },
  { to: '/proveedores', icon: Truck,           label: 'Proveedores',  group: 'inventario', permission: 'ver-proveedores' },
  { to: '/movimientos', icon: ArrowLeftRight,  label: 'Movimientos',  group: 'inventario', permission: 'ver-movimientos' },
  { to: '/usuarios',    icon: Users,           label: 'Usuarios',     group: 'admin',      permission: 'gestionar-usuarios' },
  { to: '/roles',       icon: Shield,          label: 'Roles',        group: 'admin',      permission: 'gestionar-usuarios' }, // <-- AGREGA ESTA LÍNEA
];

export default function Sidebar() {
  const { user, logout, tienePermiso } = useAuth();

  // BYPASS DIRECTO: Si eres Admin, ves todo. Si no, filtramos por permisos de Spatie.
  const esAdmin = user?.roles?.includes('Administrador') || user?.roles?.includes('Admin') || user?.email === 'admin@gdastore.com';
  
  const itemsPermitidos = esAdmin 
    ? navItems 
    : navItems.filter(item => tienePermiso(item.permission));

  // Evaluamos dinámicamente si hay elementos permitidos en cada grupo para mostrar los encabezados
  const tienePrincipal  = itemsPermitidos.some(i => i.group === 'principal');
  const tieneInventario = itemsPermitidos.some(i => i.group === 'inventario');
  const tieneAdmin      = itemsPermitidos.some(i => i.group === 'admin');

  const activeLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 13.5,
    fontWeight: 500,
    background: isActive ? 'var(--accent)' : 'transparent',
    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
    boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.4)' : 'none',
  });

  return (
    <div style={{
      width: 240, background: 'var(--navy)', display: 'flex',
      flexDirection: 'column', flexShrink: 0, height: '100vh'
    }}>
      {/* Encabezado del Logo */}
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

      {/* Navegación por Grupos */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        
        {/* Sección Principal */}
        {tienePrincipal && (
          <>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, padding: '12px 8px 6px' }}>Principal</div>
            {itemsPermitidos.filter(i => i.group === 'principal').map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} end style={activeLinkStyle}>
                <Icon size={16} />{label}
              </NavLink>
            ))}
          </>
        )}

        {/* Sección Inventario */}
        {tieneInventario && (
          <>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, padding: '12px 8px 6px' }}>Inventario</div>
            {itemsPermitidos.filter(i => i.group === 'inventario').map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} style={activeLinkStyle}>
                <Icon size={16} />{label}
              </NavLink>
            ))}
          </>
        )}

        {/* Sección Administración */}
        {tieneAdmin && (
          <>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, padding: '12px 8px 6px' }}>Administración</div>
            {itemsPermitidos.filter(i => i.group === 'admin').map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} style={activeLinkStyle}>
                <Icon size={16} />{label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Sección del Perfil del Usuario en el Bottom */}
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
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{user?.roles?.[0] || 'Administrador'}</div>
        </div>
        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4 }}>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}