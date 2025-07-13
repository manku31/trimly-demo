import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'customer' | 'barber') => Promise<boolean>;
  register: (userData: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('trimly_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'customer' | 'barber' = 'customer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials
      const demoCredentials = {
        customer: { email: 'demo@customer.com', password: 'demo123' },
        barber: { email: 'demo@barber.com', password: 'demo123' }
      };

      // Check demo credentials
      if (email === demoCredentials[role].email && password === demoCredentials[role].password) {
        const mockUser: User = {
          id: role === 'barber' ? 'barber-demo-001' : 'customer-demo-001',
          name: role === 'barber' ? 'Mike Johnson (Demo Barber)' : 'John Customer (Demo)',
          email,
          phone: '+1 234 567 8900',
          role,
          avatar: role === 'barber' 
            ? 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
            : 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150'
        };

        setUser(mockUser);
        localStorage.setItem('trimly_user', JSON.stringify(mockUser));
        return true;
      }

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: role === 'barber' ? 'Mike Johnson' : 'John Customer',
        email,
        phone: '+1 234 567 8900',
        role,
        avatar: role === 'barber' 
          ? 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
          : 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150'
      };

      setUser(mockUser);
      localStorage.setItem('trimly_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9)
      };

      setUser(newUser);
      localStorage.setItem('trimly_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trimly_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};