'use client';

import { useState, useEffect } from 'react';
import { Product, ProductFilters, PaginationInfo } from '@/types';
import { productsAPI } from '@/lib/api';

interface UseProductsResult {
  products: Product[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(filters: ProductFilters = {}, enabled: boolean = true): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getAll(filters);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters), enabled]);

  return {
    products,
    pagination,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}

export function useProduct(id: string, enabled: boolean = true) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!enabled || !id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data.product);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch product');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, enabled]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

export function useMyProducts(filters: any = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getMyProducts(filters);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch your products');
      setProducts([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [JSON.stringify(filters)]);

  return {
    products,
    pagination,
    isLoading,
    error,
    refetch: fetchMyProducts,
  };
}

export function useProductCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data.categories);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}