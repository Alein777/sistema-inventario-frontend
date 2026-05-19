import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /**
   * FUNCIÓN DE PERMISOS ULTRA-ESTABLE Y COMPATIBLE
   */
  const tienePermiso = (permiso) => {
    console.log("🔍 EVALUANDO PERMISO PARA EL USUARIO:", { usuario: user, permisoSolicitado: permiso });
    // 1. Si no hay usuario en sesión, denegar inmediatamente sin romper nada
    if (!user) return false;

    // 2. Bypass total para el Administrador principal (Por correo o por rol)
    if (
      user.email === 'admin@gdastore.com' || 
      user.roles?.includes('Administrador') || 
      user.roles?.includes('Admin') ||
      user.role === 'Administrador'
    ) {
      return true;
    }

    // Si un componente no solicita un permiso específico, lo dejamos pasar por seguridad
    if (!permiso) return true;

    // 3. CASO A: Los permisos vienen de AuthController (Login/Me) -> Array plano en español ['ver-productos']
    if (user.permisos && Array.isArray(user.permisos)) {
      return user.permisos.includes(permiso);
    }

    // 4. CASO B: Los permisos vienen de UserController (Spatie por defecto) -> Array de objetos en inglés [{name: 'ver-productos'}]
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.some(p => p.name === permiso || p === permiso);
    }

    // 5. CASO C: Soporte extra por si Spatie lo devuelve como array plano en inglés ['ver-productos']
    if (user.roles && Array.isArray(user.permissions)) {
      return user.permissions.includes(permiso);
    }

    // Si no cumple ninguna, denegamos pacíficamente sin colapsar la app
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, tienePermiso }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);