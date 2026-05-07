import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Proveedores from './pages/Proveedores';
import Movimientos from './pages/Movimientos';
import Usuarios from './pages/Usuarios';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f4f6f9' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/productos" element={<PrivateRoute><AppLayout><Productos /></AppLayout></PrivateRoute>} />
      <Route path="/categorias" element={<PrivateRoute><AppLayout><Categorias /></AppLayout></PrivateRoute>} />
      <Route path="/proveedores" element={<PrivateRoute><AppLayout><Proveedores /></AppLayout></PrivateRoute>} />
      <Route path="/movimientos" element={<PrivateRoute><AppLayout><Movimientos /></AppLayout></PrivateRoute>} />
      <Route path="/usuarios" element={<PrivateRoute><AppLayout><Usuarios /></AppLayout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}