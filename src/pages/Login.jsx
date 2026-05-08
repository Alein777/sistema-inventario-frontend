import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/login', form);
      login(data.user, data.token);
      toast.success('Bienvenido ' + data.user.name);
      navigate('/');
    } catch {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
    }}>

      {/* Panel izquierdo — azul navy */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, #1a3a6b 0%, #0f1f3d 60%, #0a1628 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '48px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Blob 1 */}
        <div style={{
          position: 'absolute', width: 420, height: 420,
          borderRadius: '50%',
          background: 'rgba(59, 111, 212, 0.25)',
          top: -100, right: -100,
        }} />
        {/* Blob 2 */}
        <div style={{
          position: 'absolute', width: 300, height: 300,
          borderRadius: '50%',
          background: 'rgba(59, 111, 212, 0.18)',
          bottom: -80, left: -60,
        }} />
        {/* Blob 3 sutil */}
        <div style={{
          position: 'absolute', width: 200, height: 200,
          borderRadius: '50%',
          background: 'rgba(100, 160, 255, 0.1)',
          top: '40%', left: '30%',
        }} />

        {/* Logo GDA Store */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40,
            background: '#3b6fd4',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="12" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="3" y="12" width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="12" y="12" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>GDA Store</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: 1 }}>INVENTARIO</div>
          </div>
        </div>

        {/* Texto principal */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 52, fontWeight: 800, color: '#fff',
            lineHeight: 1.1, margin: '0 0 16px',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}>
            Welcome<br />Back!
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: 0, maxWidth: 280 }}>
            Gestiona tu inventario de forma fácil y eficiente.
          </p>
        </div>

        {/* Footer del panel */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            © 2025 GDA Store — Sistema de Inventario
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{
        flex: 1,
        background: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '44px 48px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1a2332', margin: '0 0 6px' }}>
            Iniciar sesión
          </h2>
          <p style={{ fontSize: 13, color: '#8a93a0', margin: '0 0 32px' }}>
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Correo electrónico
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@gdastore.com"
                style={{
                  padding: '11px 14px',
                  border: '1.5px solid #e8eaed',
                  borderRadius: 10, fontSize: 14,
                  outline: 'none', color: '#1a2332',
                  background: '#fafbfc',
                }}
                onFocus={e => e.target.style.borderColor = '#3b6fd4'}
                onBlur={e => e.target.style.borderColor = '#e8eaed'}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '11px 42px 11px 14px',
                    border: '1.5px solid #e8eaed',
                    borderRadius: 10, fontSize: 14,
                    outline: 'none', color: '#1a2332',
                    background: '#fafbfc',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b6fd4'}
                  onBlur={e => e.target.style.borderColor = '#e8eaed'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#9aa0b0',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                padding: '13px',
                background: '#3b6fd4',
                color: '#fff', border: 'none',
                borderRadius: 10, fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                boxShadow: '0 4px 16px rgba(59,111,212,0.35)',
                transition: 'background 0.2s, transform 0.1s',
              }}
              onMouseEnter={e => { if (!loading) { e.target.style.background = '#2f5db8'; e.target.style.transform = 'translateY(-1px)'; }}}
              onMouseLeave={e => { e.target.style.background = '#3b6fd4'; e.target.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
