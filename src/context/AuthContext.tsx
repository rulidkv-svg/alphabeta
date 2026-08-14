import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserSession } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  session: UserSession | null;
  loading: boolean;
  login: (identifier: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string; user?: User }>;
  register: (data: any) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  quickSwitchUser: (role: UserRole) => Promise<void>;
  updateUserInContext: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session
    const savedUser = localStorage.getItem('ab_user');
    const savedToken = localStorage.getItem('ab_token');
    const savedSession = localStorage.getItem('ab_session');

    if (savedUser && savedToken) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        if (savedSession) {
          setSession(JSON.parse(savedSession));
        }
      } catch (e) {
        localStorage.removeItem('ab_user');
        localStorage.removeItem('ab_token');
        localStorage.removeItem('ab_session');
      }
    } else {
      setUser(null);
      setToken(null);
      setSession(null);
    }
    setLoading(false);
  }, []);

  const login = async (identifier: string, pass: string, rememberMe: boolean = false) => {
    try {
      const res = await apiService.login(identifier, pass, rememberMe);
      if (res.success && res.user && res.token) {
        const u = res.user;
        const newSession: UserSession = {
          UserID: u.UserID,
          Role: u.Role,
          Name: u.Name,
          Email: u.Email,
          Phone: u.Phone,
          LoginTime: new Date().toISOString(),
          SessionStatus: 'ACTIVE',
          Token: res.token
        };

        setUser(u);
        setToken(res.token);
        setSession(newSession);

        localStorage.setItem('ab_user', JSON.stringify(u));
        localStorage.setItem('ab_token', res.token);
        localStorage.setItem('ab_session', JSON.stringify(newSession));

        return { success: true, user: u };
      }
      return { success: false, message: res.message || 'Login gagal.' };
    } catch (e: any) {
      return { success: false, message: 'Terjadi masalah koneksi dengan server.' };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await apiService.register(data);
      if (res.success && res.user && res.token) {
        const u = res.user;
        const newSession: UserSession = {
          UserID: u.UserID,
          Role: u.Role,
          Name: u.Name,
          Email: u.Email,
          Phone: u.Phone,
          LoginTime: new Date().toISOString(),
          SessionStatus: 'ACTIVE',
          Token: res.token
        };

        setUser(u);
        setToken(res.token);
        setSession(newSession);

        localStorage.setItem('ab_user', JSON.stringify(u));
        localStorage.setItem('ab_token', res.token);
        localStorage.setItem('ab_session', JSON.stringify(newSession));

        return { success: true, user: u };
      }
      return { success: false, message: res.message || 'Pendaftaran gagal.' };
    } catch (e: any) {
      return { success: false, message: 'Terjadi kesalahan sistem saat pendaftaran.' };
    }
  };

  const logout = () => {
    if (user?.UserID) {
      apiService.logoutUser(user.UserID).catch(() => {});
    }
    setUser(null);
    setToken(null);
    setSession(null);
    localStorage.removeItem('ab_user');
    localStorage.removeItem('ab_token');
    localStorage.removeItem('ab_session');
  };

  const quickSwitchUser = async (role: UserRole) => {
    let identifier = 'budi@alphabeta.edu.eu.org';
    let pass = 'peserta123';

    if (role === 'INSTRUKTUR') {
      identifier = 'roni@alphabeta.edu.eu.org';
      pass = 'instruktur123';
    } else if (role === 'PELATIH') {
      identifier = 'ine@alphabeta.edu.eu.org';
      pass = 'pelatih123';
    } else if (role === 'ADMIN') {
      identifier = 'admin@alphabeta.edu.eu.org';
      pass = 'admin123';
    }

    await login(identifier, pass, true);
  };

  const updateUserInContext = (updated: User) => {
    setUser(updated);
    localStorage.setItem('ab_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        session,
        loading,
        login,
        register,
        logout,
        quickSwitchUser,
        updateUserInContext
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
