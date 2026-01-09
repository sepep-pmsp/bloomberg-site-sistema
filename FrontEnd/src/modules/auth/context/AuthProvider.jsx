import { useState, useEffect } from 'react';
import side from '../services/auth.service';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await side.get('/api/me');
        setUser(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function login(email, password) {
    const { data } = await side.post('/api/login', { email, password });
    setUser(data.user);
  }

  async function logout() {
    await side.delete('/api/logout');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, authenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}