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

  const tienePermiso = (permiso) => {
    console.log(" EVALUANDO PERMISO PARA EL USUARIO:", { usuario: user, permisoSolicitado: permiso });
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
    
    if (!permiso) return true;

    if (user.permisos && Array.isArray(user.permisos)) {
      return user.permisos.includes(permiso);
    }

    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.some(p => p.name === permiso || p === permiso);
    }

    if (user.roles && Array.isArray(user.permissions)) {
      return user.permissions.includes(permiso);
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, tienePermiso }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);