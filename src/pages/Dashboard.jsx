import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Tag, Truck, ArrowLeftRight, AlertTriangle } from 'lucide-react';

function MetricCard({ icon: Icon, color, value, label, trend }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 12,
      padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '12px 12px 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        {trend && <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: '#f0fdf4', color: 'var(--success)' }}>{trend}</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ productos: 0, categorias: 0, proveedores: 0, movimientos: 0, stockBajo: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prod, cat, prov, mov] = await Promise.all([
          api.get('/productos'),
          api.get('/categorias'),
          api.get('/proveedores'),
          api.get('/movimientos'),
        ]);
        const productos = prod.data.data || [];
        setStats({
          productos: productos.length,
          categorias: (cat.data.data || []).length,
          proveedores: (prov.data.data || []).length,
          movimientos: (mov.data.data || []).length,
          stockBajo: productos.filter(p => p.stock <= p.stock_minimo).length,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        <MetricCard icon={Package}       color="#2563eb" value={stats.productos}   label="Total productos"      trend="+activos" />
        <MetricCard icon={Tag}           color="#059669" value={stats.categorias}  label="Categorías"           />
        <MetricCard icon={Truck}         color="#7c3aed" value={stats.proveedores} label="Proveedores"          />
        <MetricCard icon={ArrowLeftRight}color="#0891b2" value={stats.movimientos} label="Movimientos"          />
        <MetricCard icon={AlertTriangle} color="#d97706" value={stats.stockBajo}   label="Productos stock bajo" />
      </div>
    </div>
  );
}