import React, { useEffect, useState } from 'react';
import api from '../api/axios';

import { 
  Package, Tag, Truck, ArrowLeftRight, AlertTriangle, 
  Search, Bell, ChevronDown, TrendingUp 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';


export default function Dashboard() {
  const [stats, setStats] = useState({
    productos: 0, productosActivos: 0,
    categorias: 0, categoriasActivas: 0,
    proveedores: 0, proveedoresActivos: 0,
    movimientos: 0, movimientosEntradas: 0,
    stockBajo: 0, stockCritico: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prod, cat, prov, mov] = await Promise.all([
          api.get('/productos'), api.get('/categorias'),
          api.get('/proveedores'), api.get('/movimientos'),
        ]);
        
        const productos = prod.data.data || [];
        const categorias = cat.data.data || [];
        const proveedores = prov.data.data || [];
        const movimientos = mov.data.data || [];
        
        const productosActivos = productos.filter(p => p.estado === 1).length;
        const categoriasActivas = categorias.filter(c => c.estado === 1).length;
        const proveedoresActivos = proveedores.filter(p => p.estado === 1).length;
        const movimientosEntradas = movimientos.filter(m => m.tipo === 'entrada').length;
        const movimientosSalidas = movimientos.filter(m => m.tipo === 'salida').length;
        const stockBajo = productos.filter(p => p.stock <= p.stock_minimo).length;
        const stockCritico = productos.filter(p => p.stock === 0).length;
        
        console.log('Dashboard Data:', {
          productos: productos.length,
          productosActivos,
          categorias: categorias.length,
          categoriasActivas,
          proveedores: proveedores.length,
          proveedoresActivos,
          movimientos: movimientos.length,
          movimientosEntradas,
          movimientosSalidas,
          stockBajo,
          stockCritico
        });

        setStats({
          productos: productos.length,
          productosActivos,
          categorias: categorias.length,
          categoriasActivas,
          proveedores: proveedores.length,
          proveedoresActivos,
          movimientos: movimientos.length,
          movimientosEntradas,
          movimientosSalidas,
          stockBajo,
          stockCritico,
        });
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, []);

  // --- ESTILOS ---
  const containerStyle = {
    backgroundColor: '#F4F7FE',
    minHeight: '100vh',
    padding: '30px',
    fontFamily: "'Plus Jakarta Sans', sans-serif, system-ui",
    color: '#1B2559'
  };

  const glassStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid #FFFFFF',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.03)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '35px'
  };

  return (

    <div style={containerStyle}>
      
      {/* HEADER SUPERIOR */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#A3AED0', fontSize: '14px', margin: '5px 0 0 0', fontWeight: '500' }}>
            Bienvenida de nuevo, Sarah Mitchell
          </p>
        </div>

        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '20px', 
          backgroundColor: '#FFFFFF', padding: '10px 20px', borderRadius: '30px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#F4F7FE', padding: '8px 15px', borderRadius: '20px' }}>
            <Search size={16} color="#A3AED0" />
            <input type="text" placeholder="Buscar..." style={{ border: 'none', background: 'none', outline: 'none', fontSize: '13px' }} />
          </div>
          <Bell size={20} color="#A3AED0" style={{ cursor: 'pointer' }} />
          <div style={{ width: '1px', height: '20px', backgroundColor: '#E0E5F2' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SM</div>
            <div style={{ textAlign: 'left' }}>
               <p style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>Sarah Mitchell</p>
               <p style={{ margin: 0, fontSize: '11px', color: '#A3AED0', fontWeight: '600' }}>Administradora</p>
            </div>
          </div>
          <button style={{ backgroundColor: '#7c3aed', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '15px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            Summary With AI
          </button>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '30px' }}>
        <MetricCard title="Productos" value={stats.productos} trend="+23.5%" icon={<Package size={22}/>} color="#4318FF" />
        <MetricCard title="Categorías" value={stats.categorias} trend="+12.4%" icon={<Tag size={22}/>} color="#05CD99" />
        <MetricCard title="Proveedores" value={stats.proveedores} trend="+2.1%" icon={<Truck size={22}/>} color="#7c3aed" />
        <MetricCard title="Alertas Stock" value={stats.stockBajo} trend="-3.4%" icon={<AlertTriangle size={22}/>} color="#EE5D50" />
      </div>

      {/* SECCIÓN DE GRÁFICOS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        
        {/* GRÁFICO DE BARRAS */}
        <div style={glassStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Análisis de Entidades</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#A3AED0', backgroundColor: '#F4F7FE', padding: '5px 12px', borderRadius: '10px' }}>Este Mes</span>
            </div>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Productos', activos: stats.productosActivos, total: stats.productos },
                { name: 'Categorías', activos: stats.categoriasActivas, total: stats.categorias },
                { name: 'Proveedores', activos: stats.proveedoresActivos, total: stats.proveedores },
                { name: 'Movimientos', activos: stats.movimientosEntradas, total: stats.movimientos },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E5F2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 12, fontWeight: '600'}} dy={10} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'}} />
                <Bar dataKey="activos" fill="#7c3aed" radius={[6, 6, 0, 0]} barSize={35} />
                <Bar dataKey="total" fill="#fb923c" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE DONA */}
        <div style={glassStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 20px 0' }}>Distribución de Stock</h3>
          <div style={{ width: '100%', height: '320px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[
                    { name: 'Normal', value: stats.productos - stats.stockBajo },
                    { name: 'Bajo', value: stats.stockBajo }
                  ]} 
                  innerRadius={80} 
                  outerRadius={110} 
                  paddingAngle={8} 
                  dataKey="value" 
                  stroke="none"
                >
                  <Cell fill="#7c3aed" />
                  <Cell fill="#E0E5F2" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ fontSize: '30px', fontWeight: '900', display: 'block' }}>
                {stats.productos > 0 ? Math.round(((stats.productos - stats.stockBajo) / stats.productos) * 100) : 0}%
              </span>
              <span style={{ fontSize: '10px', color: '#A3AED0', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Saludable</span>
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #F4F7FE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7c3aed' }}></div>
                <span style={{ fontSize: '14px', color: '#A3AED0', fontWeight: '600' }}>Stock Normal</span>
              </div>
              <span style={{ fontWeight: '700' }}>{stats.productos - stats.stockBajo}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E0E5F2' }}></div>
                <span style={{ fontSize: '14px', color: '#A3AED0', fontWeight: '600' }}>Bajo / Crítico</span>
              </div>
              <span style={{ fontWeight: '700' }}>{stats.stockBajo}</span>
            </div>
          </div>
        </div>

        {/* GRÁFICO DE MOVIMIENTOS */}
        <div style={glassStyle}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 20px 0' }}>Movimientos del Mes</h3>
          <div style={{ width: '100%', height: '280px', backgroundColor: 'rgba(5, 205, 153, 0.05)', borderRadius: '8px', padding: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Entradas', value: stats.movimientosEntradas || 5 },
                { name: 'Salidas', value: stats.movimientosSalidas || 3 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E5F2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 12, fontWeight: '600'}} dy={10} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'}} />
                <Bar dataKey="value" fill="#05CD99" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

// COMPONENTE DE TARJETA MÉTRICA
function MetricCard({ title, value, trend, icon, color }) {
  return (
    <div style={{ 
      backgroundColor: '#FFFFFF', 
      padding: '20px', 
      borderRadius: '22px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '18px',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.02)',
      border: '1px solid #FFFFFF'
    }}>
      <div style={{ 
        backgroundColor: '#F4F7FE', 
        color: color, 
        width: '55px', 
        height: '55px', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: '#A3AED0', fontSize: '12px', fontWeight: '700', margin: 0 }}>{title}</p>
        <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '2px 0', color: '#1B2559' }}>{value}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ color: trend.startsWith('+') ? '#05CD99' : '#EE5D50', fontSize: '12px', fontWeight: '800' }}>{trend}</span>
          <span style={{ color: '#A3AED0', fontSize: '10px', fontWeight: '600' }}>vs último mes</span>
        </div>

      </div>
    </div>
  );
}