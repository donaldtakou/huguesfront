import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // Reduced timeout for faster fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token helpers
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors and timeouts
    if (!error.response) {
      // Network error, timeout, or server not responding
      const errorMessage = error.code === 'ECONNABORTED' 
        ? 'Request timeout - server took too long to respond'
        : 'Network error - unable to connect to server';
      
      console.error('Network error:', error.message);
      return Promise.reject({
        response: {
          data: {
            success: false,
            message: errorMessage,
          }
        },
        message: error.message,
        code: error.code
      });
    }

    // Handle token expiration and auth errors
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      // Don't redirect if already on auth pages or admin pages (for development)
      if (!currentPath.includes('/auth/') && !currentPath.includes('/admin')) {
        removeAuthToken();
        window.location.href = '/auth/login';
      }
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (data: any) => api.put('/auth/profile', data),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => api.put('/auth/change-password', data),

  logout: () => api.post('/auth/logout'),

  verifyToken: () => api.get('/auth/verify'),

  refreshToken: () => api.post('/auth/refresh'),
};

// Products API
export const productsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    featured?: boolean;
  }) => api.get('/products', { params }),

  getById: (id: string) => api.get(`/products/${id}`),

  create: (data: FormData) =>
    api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: FormData) =>
    api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) => api.delete(`/products/${id}`),

  getMyProducts: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get('/products/user/my-products', { params }),

  getCategories: () => api.get('/products/stats/categories'),
};

// Users API
export const usersAPI = {
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getProducts: (id: string, params?: any) => api.get(`/users/${id}/products`, { params }),
  getStats: (id: string) => api.get(`/users/${id}/stats`),
  getDashboard: (id: string) => api.get(`/users/${id}/dashboard`),
};

// Orders API
export const ordersAPI = {
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  cancel: (id: string) => api.delete(`/orders/${id}`),
  getMyOrders: (params?: any) => api.get('/orders/user/my-orders', { params }),
};

// Payments API
export const paymentsAPI = {
  initiate: (data: any) => api.post('/payments/initiate', data),
  verify: (transactionId: string) => api.get(`/payments/verify/${transactionId}`),
  getMyPayments: (params?: any) => api.get('/payments/user/my-payments', { params }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Users management
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => api.patch(`/admin/users/${id}/status`, data),
  
  // Products management
  getProducts: (params?: any) => api.get('/admin/products', { params }),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  importProducts: (file: FormData) => api.post('/admin/products/import', file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // Orders management
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, data: any) => api.patch(`/admin/orders/${id}/status`, data),
  
  // Payments management
  getPayments: (params?: any) => api.get('/admin/payments', { params }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
};

export default api;