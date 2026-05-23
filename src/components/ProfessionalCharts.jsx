import React from 'react';

export function CircularProgress({ percentage, color, label, size = 120 }) {
  const radius = (size / 2) - 12;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 12,
      padding: 20,
      background: 'linear-gradient(135deg, #f8fafc, #fff)',
      borderRadius: 16,
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'linear-gradient(90deg, ' + color + ', transparent)',
        borderRadius: '16px 16px 0 0'
      }} />
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 0 8px ' + color + '40)'
          }}
        />
      </svg>
      <div style={{ 
        fontSize: 16, 
        fontWeight: 700, 
        color: '#1f2937',
        textAlign: 'center',
        marginTop: 8
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: 24, 
        fontWeight: 800, 
        color: color,
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: 4
      }}>
        {percentage}%
      </div>
    </div>
  );
}

export function BarChart({ data, color, title }) {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Evitar división por 0
  
  return (
    <div style={{ 
      padding: 20, 
      background: '#fff', 
      borderRadius: 16, 
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: 18, 
        fontWeight: 700, 
        color: '#1f2937',
        letterSpacing: '-0.025em'
      }}>
        {title}
      </h3>
      
      {data.length === 0 || maxValue === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: 40, 
          color: '#64748b', 
          fontSize: 14
        }}>
          No hay datos disponibles
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {data.map((item, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: `${(item.value / maxValue) * 100}%`,
                background: `linear-gradient(180deg, ${color}, ${color}dd)`,
                borderRadius: '8px 8px 0 0',
                position: 'relative',
                transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: color,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 12,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {item.value}
                </div>
              </div>
              <div style={{ 
                fontSize: 12, 
                color: '#64748b', 
                fontWeight: 500, 
                marginTop: 8,
                textAlign: 'center'
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MetricCard({ icon: Icon, color, value, label, trend }) {
  return (
    <div style={{
      background: '#fff', 
      border: '1px solid var(--border)', 
      borderRadius: 12,
      padding: 20, 
      position: 'relative', 
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: 3, 
        background: color, 
        borderRadius: '12px 12px 0 0' 
      }} />
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between', 
        marginBottom: 14 
      }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 10, 
          background: color + '20', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Icon size={18} color={color} />
        </div>
        {trend && <span style={{ 
          fontSize: 11, 
          fontWeight: 600, 
          padding: '3px 8px', 
          borderRadius: 20, 
          background: '#f0fdf4', 
          color: 'var(--success)' 
        }}>{trend}</span>}
      </div>
      <div style={{ 
        fontSize: 28, 
        fontWeight: 700, 
        lineHeight: 1 
      }}>{value}</div>
      <div style={{ 
        fontSize: 12.5, 
        color: 'var(--muted)', 
        marginTop: 4, 
        fontWeight: 500 
      }}>{label}</div>
    </div>
  );
}
