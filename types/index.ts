export interface User {
  id: string;
  _id?: string; // Compatibilité MongoDB
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: {
    url: string;
    alt: string;
  };
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  isEmailVerified: boolean;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    region: string;
    country: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    currency: string;
  };
  statistics: {
    totalProductsSold: number;
    totalProductsBought: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
  };
  createdAt: string;
  lastLogin?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: 'smartphone' | 'tablet' | 'smartwatch' | 'laptop' | 'desktop' | 'accessory' | 'other';
  brand: string;
  model: string;
  condition: 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
  price: number;
  originalPrice?: number;
  images: {
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  specifications: {
    storage?: string;
    ram?: string;
    screenSize?: string;
    processor?: string;
    operatingSystem?: string;
    color?: string;
    warranty?: string;
    batteryHealth?: string;
    accessories?: string[];
  };
  availability: 'in-stock' | 'out-of-stock' | 'reserved';
  stock?: number;
  seller: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: { url: string; alt: string };
    statistics: {
      averageRating: number;
      totalReviews: number;
    };
    phone?: string;
    email?: string;
    createdAt: string;
  };
  views: number;
  isValidated: boolean;
  validatedBy?: string;
  validatedAt?: string;
  isFeatured: boolean;
  tags: string[];
  location: {
    city: string;
    region: string;
    country: string;
  };
  discountPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  seller: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  product: {
    _id: string;
    name: string;
    images: { url: string; alt: string; isPrimary: boolean }[];
    price: number;
  };
  quantity: number;
  price: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'disputed';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'transfer' | 'cash' | 'other';
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    region: string;
    country: string;
  };
  shipping: {
    method: 'standard' | 'express' | 'pickup' | 'other';
    cost: number;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
  };
  timeline: {
    status: string;
    timestamp: string;
    note?: string;
    updatedBy?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductFilters {
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  page?: number;
  limit?: number;
  seller?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
  filters: ProductFilters;
}

export interface CategoryStats {
  _id: string;
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface AdminDashboard {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    pendingValidation: number;
  };
  recent: {
    users: User[];
    products: Product[];
    orders: Order[];
  };
  analytics: {
    categories: CategoryStats[];
    monthlyRevenue: {
      _id: { year: number; month: number };
      revenue: number;
      orders: number;
    }[];
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}

export interface CSVImportResult {
  message: string;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
  products?: Product[];
  errors?: {
    row: number;
    error: string;
    data: any;
  }[];
}