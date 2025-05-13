import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  user: { username: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<{ username: string } | null>(() => {
    const username = localStorage.getItem('username');
    return username ? { username } : null;
  });

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);
    const decoded = parseJwt(token);
    const username = decoded?.username;
    setUser(username ? { username } : null);
    localStorage.setItem('username', username || '');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (savedToken && username) {
      setToken(savedToken);
      setUser({ username });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Helper to decode JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}
