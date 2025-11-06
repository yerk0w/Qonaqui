import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext(null);

const profileEndpoint = '/auth/profile';
const loginEndpoint = '/auth/login';
const registerEndpoint = '/auth/register';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await apiClient.request(profileEndpoint);
      setUser(profile);
      setError(null);
      return profile;
    } catch (err) {
      setUser(null);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (apiClient.getAccessToken()) {
      fetchProfile().catch(() => {});
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const handleAuthSuccess = useCallback(async (response) => {
    apiClient.setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return fetchProfile();
  }, [fetchProfile]);

  const login = useCallback(async (credentials) => {
    const response = await apiClient.request(loginEndpoint, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return handleAuthSuccess(response);
  }, [handleAuthSuccess]);

  const register = useCallback(async (payload) => {
    const response = await apiClient.request(registerEndpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return handleAuthSuccess(response);
  }, [handleAuthSuccess]);

  const logout = useCallback(() => {
    apiClient.clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshProfile: fetchProfile,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles?.some((role) => role === user?.role),
    isAuthenticated: Boolean(user),
  }), [user, isLoading, error, login, register, logout, fetchProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
