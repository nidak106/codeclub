import { useEffect, useState } from 'react';
import { AuthContext } from './authContextValue';
import { API_BASE_URL } from '../api';

async function requestAuth(path, options = {}, token = null) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.status !== 'success') {
    throw new Error(payload.error || 'Something went wrong. Please try again.');
  }
  return payload.data;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('auth_token')));

  useEffect(() => {
    if (!token) return undefined;
    requestAuth('/api/auth/me', {}, token)
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const saveSession = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem('auth_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (credentials) => {
    const data = await requestAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    saveSession(data);
    return data.user;
  };

  const register = async (credentials) => {
    const data = await requestAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    saveSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const acceptDisclaimer = async () => {
    const data = await requestAuth('/api/auth/accept-disclaimer', { method: 'POST' }, token);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, acceptDisclaimer }}>
      {children}
  </AuthContext.Provider>
  );
}

