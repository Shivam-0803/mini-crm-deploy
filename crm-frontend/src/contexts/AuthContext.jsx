import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const response = await api.get('/auth/me', { withCredentials: true });
      console.log('Auth response:', response.data);
      
      if (response.data && response.data.user) {
        console.log('Auth check successful:', response.data.user);
        setUser(response.data.user);
        setError(null);
      } else {
        console.log('Auth check returned no user');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error.response || error);
      setUser(null);
      if (error.response?.status === 401) {
        console.log('User is not authenticated');
        navigate('/login');
      } else {
        setError('Authentication check failed');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(location.pathname !== '/login') {
      checkAuth();
    } else {
      setLoading(false);
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    
    if (authSuccess === 'true') {
      console.log('Detected successful OAuth callback');
      checkAuth();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.pathname]);

  const login = () => {
    try {
      console.log('Initiating Google OAuth login...');
      window.location.href = `${api.defaults.baseURL}/auth/google`;
    } catch (error) {
      console.error('Login redirect failed:', error);
      setError('Login failed');
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await api.get('/auth/logout', { withCredentials: true });
      setUser(null);
      setError(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed');
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
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
