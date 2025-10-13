'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ProductFilters {
  category?: string;
  search?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  featured?: boolean;
  seller?: string;
}

// Cache pour éviter les requêtes redondantes
const cache = new Map<string, { data: any; timestamp: number; expiry: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(filters: ProductFilters): string {
  return JSON.stringify(filters);
}

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiry: Date.now() + CACHE_DURATION
  });
}

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const cacheKey = getCacheKey(filters);
    
    // Vérifier le cache sauf si refresh forcé
    if (!forceRefresh) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setProducts(cachedData.products || []);
        setPagination(cachedData.pagination || null);
        setIsLoading(false);
        setError(null);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const params: any = {
        page: filters.page || 1,
        limit: filters.limit || 12,
      };

      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.condition) params.condition = filters.condition;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters.featured) params.featured = filters.featured;
      if (filters.seller) params.seller = filters.seller;

      const response = await api.get('/products', { 
        params,
        signal: abortControllerRef.current.signal,
        timeout: 10000 // 10 secondes de timeout
      });
      
      const responseData = {
        products: response.data.products || [],
        pagination: response.data.pagination || null
      };

      setProducts(responseData.products);
      setPagination(responseData.pagination);
      setLastUpdate(new Date());
      
      // Mise en cache
      setCachedData(cacheKey, responseData);
      
    } catch (err: any) {
      if (err.name === 'CanceledError') {
        return; // Requête annulée, ne pas traiter comme une erreur
      }
      
      console.error('Erreur lors du chargement des produits:', err);
      
      // Gestion spécifique des erreurs réseau
      if (err.code === 'NETWORK_ERROR' || err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 5000.');
      } else if (err.response?.status === 404) {
        setError('Service non trouvé. Vérifiez la configuration de l\'API.');
      } else if (err.response?.status >= 500) {
        setError('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement des produits');
      }
      
      // Ajouter des données de fallback pour permettre le test des images
      console.warn('Utilisation des données de fallback pour le développement');
      const fallbackProducts = [
        {
          _id: 'fallback-1',
          name: 'iPhone 15 Pro Max',
          description: 'Dernier iPhone avec puce A17 Pro - Mode développement',
          price: 1200000,
          originalPrice: 1400000,
          category: 'smartphone',
          brand: 'Apple',
          condition: 'new',
          images: [], // Pas d'images pour tester nos fallbacks
          stock: 5,
          seller: 'FastDeal Store',
          isValidated: true,
          isFeatured: true,
          discountPercentage: 15
        },
        {
          _id: 'fallback-2',
          name: 'MacBook Pro M3',
          description: 'Ordinateur portable professionnel - Mode développement',
          price: 2500000,
          category: 'laptop',
          brand: 'Apple',
          condition: 'new',
          images: [],
          stock: 3,
          seller: 'FastDeal Store',
          isValidated: true,
          isFeatured: true,
          discountPercentage: 0
        },
        {
          _id: 'fallback-3',
          name: 'iPad Air',
          description: 'Tablette polyvalente pour le travail - Mode développement',
          price: 800000,
          category: 'tablet',
          brand: 'Apple',
          condition: 'new',
          images: [],
          stock: 8,
          seller: 'FastDeal Store',
          isValidated: true,
          isFeatured: true,
          discountPercentage: 0
        },
        {
          _id: 'fallback-4',
          name: 'Apple Watch Ultra',
          description: 'Montre connectée premium - Mode développement',
          price: 900000,
          category: 'smartwatch',
          brand: 'Apple',
          condition: 'new',
          images: [],
          stock: 2,
          seller: 'FastDeal Store',
          isValidated: true,
          isFeatured: true,
          discountPercentage: 0
        }
      ];
      
      setProducts(fallbackProducts);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: fallbackProducts.length,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [
    filters.category,
    filters.search,
    filters.condition,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
    filters.sortOrder,
    filters.page,
    filters.limit,
    filters.featured,
    filters.seller,
  ]);

  // Fonction pour forcer le rafraîchissement
  const refreshProducts = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // Auto-refresh toutes les 30 secondes si la page est visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden && !isLoading) {
        fetchProducts(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchProducts, isLoading]);

  // Rafraîchir quand la page redevient visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && lastUpdate) {
        const timeSinceUpdate = Date.now() - lastUpdate.getTime();
        // Rafraîchir si plus de 2 minutes depuis la dernière mise à jour
        if (timeSinceUpdate > 2 * 60 * 1000) {
          refreshProducts();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [lastUpdate, refreshProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    isLoading,
    error,
    lastUpdate,
    refreshProducts,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchCategories = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'categories';
    
    // Vérifier le cache sauf si refresh forcé
    if (!forceRefresh) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setCategories(cachedData);
        setIsLoading(false);
        setError(null);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Récupérer les catégories avec comptage des produits
      const response = await api.get('/products');
      const allProducts = response.data.products || [];
      
      // Compter les produits par catégorie
      const categoryCounts = allProducts.reduce((acc: any, product: any) => {
        const category = product.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const categoriesWithCounts = [
        { 
          id: 'smartphone',
          _id: 'smartphone', 
          name: 'Smartphones', 
          description: 'Téléphones intelligents dernière génération',
          productCount: categoryCounts.smartphone || 0
        },
        { 
          id: 'tablet',
          _id: 'tablet', 
          name: 'Tablettes', 
          description: 'Tablettes et iPads reconditionnés',
          productCount: categoryCounts.tablet || 0
        },
        { 
          id: 'laptop',
          _id: 'laptop', 
          name: 'Ordinateurs portables', 
          description: 'MacBooks et PC portables performants',
          productCount: categoryCounts.laptop || 0
        },
        { 
          id: 'desktop',
          _id: 'desktop', 
          name: 'Ordinateurs de bureau', 
          description: 'PC fixes et stations de travail',
          productCount: categoryCounts.desktop || 0
        },
        { 
          id: 'smartwatch',
          _id: 'smartwatch', 
          name: 'Montres connectées', 
          description: 'Apple Watch et montres intelligentes',
          productCount: categoryCounts.smartwatch || 0
        },
        { 
          id: 'accessory',
          _id: 'accessory', 
          name: 'Accessoires', 
          description: 'Écouteurs, coques, chargeurs',
          productCount: categoryCounts.accessory || 0
        }
      ];
        
      setCategories(categoriesWithCounts);
      setLastUpdate(new Date());
      
      // Mise en cache
      setCachedData(cacheKey, categoriesWithCounts);
      
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setError('Erreur lors du chargement des catégories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh toutes les 60 secondes si la page est visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden && !isLoading) {
        fetchCategories(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchCategories, isLoading]);

  // Rafraîchir quand la page redevient visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && lastUpdate) {
        const timeSinceUpdate = Date.now() - lastUpdate.getTime();
        // Rafraîchir si plus de 3 minutes depuis la dernière mise à jour
        if (timeSinceUpdate > 3 * 60 * 1000) {
          fetchCategories(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [lastUpdate, fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    lastUpdate,
    refreshCategories: () => fetchCategories(true),
  };
}

export default useProducts;