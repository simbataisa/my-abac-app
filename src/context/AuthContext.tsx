// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App, Spin } from 'antd'; // Change from message to App
import { authService } from '../services/authService';
import {
  ActionAttributes,
  EnvironmentAttributes,
  LoginCredentials,
  RegisterData,
  ResourceAttributes,
  UserAttributes,
} from '../types/auth';
import { ABACPolicy } from '@/utils/abac';

interface AuthContextType {
  user: UserAttributes | null;
  environment: EnvironmentAttributes;
  policy: ABACPolicy;
  can: (action: ActionAttributes, resource: ResourceAttributes) => boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { message } = App.useApp(); // Use the message hook
  const [user, setUser] = useState<UserAttributes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [environment] = useState<EnvironmentAttributes>({});
  const navigate = useNavigate();
  const location = useLocation();

  const [policy] = useState(() => {
    const abacPolicy = new ABACPolicy();

    // Admin has full access
    abacPolicy.addRule({
      effect: 'allow',
      condition: user => user.role === 'admin',
    });

    // Department-specific rules
    abacPolicy.addRule({
      effect: 'allow',
      condition: (user, resource, action) => {
        return (
          user.role === 'manager' &&
          user.department === resource.department &&
          ['read', 'write', 'update'].includes(action.name)
        );
      },
    });

    // Regular user rules
    abacPolicy.addRule({
      effect: 'allow',
      condition: (user, resource, action) => {
        return (
          user.role === 'user' &&
          user.department === resource.department &&
          action.name === 'read'
        );
      },
    });

    // Time-based access rules
    abacPolicy.addRule({
      effect: 'allow',
      condition: (user, resource, action) => {
        const currentHour = new Date().getHours();
        return (
          user.role === 'user' &&
          resource.type === 'document' &&
          action.name === 'read' &&
          currentHour >= 9 && // 9 AM
          currentHour < 17 // 5 PM
        );
      },
    });

    // Clearance level rules
    abacPolicy.addRule({
      effect: 'allow',
      condition: (user, resource) => {
        const userClearance = user.clearanceLevel || 0;
        const requiredClearance = resource.requiredClearance || 0;
        return userClearance >= requiredClearance;
      },
    });

    // Region-based access
    abacPolicy.addRule({
      effect: 'allow',
      condition: (user, resource) => {
        if (!resource.region) return true;
        return (
          user.region === resource.region ||
          user.region === 'Global' ||
          resource.region === 'Global'
        );
      },
    });

    // Special features access
    abacPolicy.addRule({
      effect: 'allow',
      condition: (user, resource) => {
        return (
          resource.type === 'feature' &&
          (user.features
            ? user.features.includes(resource.featureName || '')
            : false)
        );
      },
    });

    // Sensitive data access
    abacPolicy.addRule({
      effect: 'deny',
      condition: (user, resource) => {
        return (
          resource.sensitivity === 'high' &&
          !['admin', 'security-officer'].includes(user.role)
        );
      },
    });

    return abacPolicy;
  });

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const token = authService.getToken();
        if (!token) {
          throw new Error('No token found');
        }

        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          throw new Error('No user found');
        }

        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Authentication failed', error);
        authService.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      message.success('Successfully logged in');

      // Redirect to the original requested page or dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      setUser(null);
      setIsAuthenticated(false);
      message.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
      message.success('Successfully registered');
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setUser(null);
      setIsAuthenticated(false);
      message.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      message.success('Successfully logged out');
      navigate('/login', { replace: true });
    } catch (error: any) {
      message.error(error.message || 'Logout failed');
      // Clear state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const can = (
    action: ActionAttributes,
    resource: ResourceAttributes
  ): boolean => {
    if (!user || !isAuthenticated) return false;
    return policy.evaluate(user, resource, action, environment);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        environment,
        policy,
        can,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
