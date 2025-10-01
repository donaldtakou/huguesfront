'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, RegisterData } from '@/types';
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  details?: any[];
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const checkAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Verify token first
      await authAPI.verifyToken();
      
      // Get user profile
      const userResponse = await authAPI.getProfile();
      
      if (userResponse.data.success) {
        const user = userResponse.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        throw new Error('Failed to get user profile');
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      removeAuthToken();
      localStorage.removeItem('user');
      setState({ 
        user: null, 
        isLoading: false, 
        isAuthenticated: false, 
        error: error.response?.data?.message || 'Authentication failed'
      });
    }
  }, [setLoading, setError]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!email.trim() || !password.trim()) {
        throw new Error('Email and password are required');
      }

      const response = await authAPI.login({ 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        setAuthToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });

        toast.success('Login successful!');
        return { success: true, user };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      const errorDetails = error.response?.data?.details || [];
      
      setError(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
      };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      const { firstName, lastName, email, password } = userData;
      if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
        throw new Error('All required fields must be filled');
      }

      const cleanUserData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        phone: userData.phone?.trim() || undefined,
      };

      const response = await authAPI.register(cleanUserData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        setAuthToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });

        toast.success('Account created successfully!');
        return { success: true, user };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      const errorDetails = error.response?.data?.details || [];
      
      setError(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
      };
    }
  };

  const logout = async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      await authAPI.logout();
      
      removeAuthToken();
      localStorage.removeItem('user');
      
      setState({ 
        user: null, 
        isLoading: false, 
        isAuthenticated: false, 
        error: null 
      });

      toast.success('Logged out successfully');
      return { success: true };
    } catch (error: any) {
      // Even if logout fails on server, clear local data
      removeAuthToken();
      localStorage.removeItem('user');
      
      setState({ 
        user: null, 
        isLoading: false, 
        isAuthenticated: false, 
        error: null 
      });

      return { success: true }; // Always return success for logout
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.updateProfile(userData);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setState(prev => ({
          ...prev,
          user: updatedUser,
          isLoading: false,
          error: null,
        }));

        toast.success('Profile updated successfully');
        return { success: true, user: updatedUser };
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      const errorDetails = error.response?.data?.details || [];
      
      setError(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!currentPassword.trim() || !newPassword.trim()) {
        throw new Error('Current password and new password are required');
      }

      const response = await authAPI.changePassword({ 
        currentPassword: currentPassword.trim(), 
        newPassword: newPassword.trim() 
      });
      
      if (response.data.success) {
        setState(prev => ({ ...prev, isLoading: false, error: null }));
        toast.success('Password changed successfully');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Password change failed';
      const errorDetails = error.response?.data?.details || [];
      
      setError(errorMessage);
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
      };
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const refreshAuth = useCallback(() => {
    return checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshAuth,
    clearError,
  };
}