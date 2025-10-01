'use client';

import { useState, useEffect } from 'react';
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

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

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

        const response = await api.get('/products', { params });
        
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || null);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError('Erreur lors du chargement des produits');
        setProducts([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
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

  return {
    products,
    pagination,
    isLoading,
    error,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Pour l'instant, utilisons des catégories statiques
        // En production, vous pourriez avoir une API /categories
        const staticCategories = [
          { 
            _id: 'smartphone', 
            name: 'Smartphones', 
            description: 'Téléphones intelligents dernière génération',
            productCount: 0
          },
          { 
            _id: 'tablet', 
            name: 'Tablettes', 
            description: 'Tablettes et iPads reconditionnés',
            productCount: 0
          },
          { 
            _id: 'laptop', 
            name: 'Ordinateurs portables', 
            description: 'MacBooks et PC portables performants',
            productCount: 0
          },
          { 
            _id: 'desktop', 
            name: 'Ordinateurs de bureau', 
            description: 'PC fixes et stations de travail',
            productCount: 0
          },
          { 
            _id: 'smartwatch', 
            name: 'Montres connectées', 
            description: 'Apple Watch et montres intelligentes',
            productCount: 0
          },
          { 
            _id: 'accessory', 
            name: 'Accessoires', 
            description: 'Écouteurs, coques, chargeurs',
            productCount: 0
          }
        ];
        
        setCategories(staticCategories);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Erreur lors du chargement des catégories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
  };
}

export default useProducts;