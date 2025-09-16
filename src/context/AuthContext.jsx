import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'sb_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on initial render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (error) {
      console.error('Error loading user data:', error);
      // Handle corrupted localStorage data
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (!isLoading) {
      try {
        if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        else localStorage.removeItem(USER_STORAGE_KEY);
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  }, [user, isLoading]);

  // Login function with validation
  const login = useCallback((name) => {
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Invalid username');
    }
    setUser({ name: name.trim(), loginTime: new Date().toISOString() });
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
