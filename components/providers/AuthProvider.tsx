'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { api, clearToken, getToken, setToken, User } from '@/lib/api';
import {
  cacheUser,
  clearCachedUser,
  decodeJwtPayload,
  getCachedUser,
} from '@/lib/auth-session';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function hydrateUserFromSession(): User | null {
  const cached = getCachedUser();
  if (cached) return cached;

  const token = getToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload?.sub || !payload.email || !payload.role) return null;

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role as User['role'],
    firstName: '',
    lastName: '',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      clearCachedUser();
      setLoading(false);
      return;
    }

    try {
      const profile = await api.me();
      setUser(profile);
      cacheUser(profile);
    } catch {
      clearToken();
      setUser(null);
      clearCachedUser();
    } finally {
      setLoading(false);
    }
  }, []);

  useLayoutEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const sessionUser = hydrateUserFromSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);
    cacheUser(userData);
    setLoading(false);
  };

  const logout = () => {
    clearToken();
    setUser(null);
    clearCachedUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}