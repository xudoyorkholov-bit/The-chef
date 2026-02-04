import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clean up old localStorage keys (migration)
    const oldCart = localStorage.getItem('cart');
    const oldAddresses = localStorage.getItem('userAddresses');
    const oldCards = localStorage.getItem('userPaymentCards');
    
    if (oldCart) localStorage.removeItem('cart');
    if (oldAddresses) localStorage.removeItem('userAddresses');
    if (oldCards) localStorage.removeItem('userPaymentCards');
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Set a flag to prevent multiple calls
      let isMounted = true;
      
      // Import usersApi dynamically to avoid circular dependency
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          setIsLoading(false);
          // Don't remove token on timeout - just stop loading
        }
      }, 5000); // 5 second timeout
      
      import('../api/users').then(({ usersApi }) => {
        usersApi.getProfile()
          .then(userData => {
            if (isMounted) {
              clearTimeout(timeoutId);
              setUser(userData);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            if (isMounted) {
              clearTimeout(timeoutId);
              console.error('Failed to load user profile:', error);
              // Only remove token if it's actually invalid (401)
              if (error.response?.status === 401) {
                localStorage.removeItem('token');
              }
              setIsLoading(false);
            }
          });
      });
      
      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data);
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      const userId = user?.id;
      localStorage.removeItem('token');
      
      // Clear user-specific data from localStorage
      if (userId) {
        localStorage.removeItem(`cart_${userId}`);
        localStorage.removeItem(`userAddresses_${userId}`);
        localStorage.removeItem(`userPaymentCards_${userId}`);
      }
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      const userId = user?.id;
      localStorage.removeItem('token');
      
      // Clear user-specific data from localStorage
      if (userId) {
        localStorage.removeItem(`cart_${userId}`);
        localStorage.removeItem(`userAddresses_${userId}`);
        localStorage.removeItem(`userPaymentCards_${userId}`);
      }
      
      setUser(null);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
