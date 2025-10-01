'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter, Search, Grid, List, ChevronDown, SlidersHorizontal, Plus, Heart } from 'lucide-react';
import { useProducts } from '@/hooks';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getCategoryLabel, getConditionLabel, getConditionColor } from '@/lib/utils';
import { ProductFilters, Product } from '@/types';
import { toast } from 'react-hot-toast';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    condition: searchParams.get('condition') || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { products, pagination, isLoading, error } = useProducts(filters);
  const { addItem } = useCartStore();

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'smartphone', label: 'Smartphones' },
    { value: 'tablet', label: 'Tablettes' },
    { value: 'laptop', label: 'Ordinateurs portables' },
    { value: 'desktop', label: 'Ordinateurs de bureau' },
    { value: 'smartwatch', label: 'Montres connectées' },
    { value: 'accessory', label: 'Accessoires' },
    { value: 'other', label: 'Autres' },
  ];

  const conditions = [
    { value: '', label: 'Tous les états' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'very-good', label: 'Très bon' },
    { value: 'good', label: 'Bon' },
    { value: 'fair', label: 'Correct' },
    { value: 'poor', label: 'Médiocre' },
  ];

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Plus récents' },
    { value: 'createdAt-asc', label: 'Plus anciens' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'name-desc', label: 'Nom Z-A' },
  ];

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success('Produit ajouté au panier !');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h1>
          <p className="text-gray-600 mb-4">Impossible de charger les produits</p>
          <Link href="/" className="bg-green-900 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-green-900 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Catalogue FastDeal
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Découvrez notre sélection premium d'électronique d'occasion certifiée
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full px-6 py-4 text-gray-900 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/50 shadow-xl"
                />
                <Search className="absolute right-4 top-4 w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-500 hover:text-green-900"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Catégorie
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    État
                  </label>
                  <select
                    value={filters.condition || ''}
                    onChange={(e) => handleFilterChange('condition', e.target.value || undefined)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                  >
                    {conditions.map(cond => (
                      <option key={cond.value} value={cond.value}>
                        {cond.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Prix
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Prix min"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                    />
                    <input
                      type="number"
                      placeholder="Prix max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => setFilters({ sortBy: 'createdAt', sortOrder: 'desc' })}
                  className="w-full px-4 py-3 text-green-900 border border-green-900 rounded-xl hover:bg-green-50 transition-colors font-medium"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 font-medium">
                    {pagination?.totalProducts || 0} produit(s) trouvé(s)
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* View Mode */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-green-900 text-white' 
                          : 'text-gray-500 hover:text-green-900'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-green-900 text-white' 
                          : 'text-gray-500 hover:text-green-900'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: Product) => (
                      <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                        <div className="relative">
                          {product.images.length > 0 && (
                            <img
                              src={product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url}
                              alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="bg-green-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                              {getCategoryLabel(product.category)}
                            </span>
                          </div>
                          {product.discountPercentage > 0 && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                -{product.discountPercentage}%
                              </span>
                            </div>
                          )}
                          <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                            <Heart className="w-5 h-5 text-gray-600 hover:text-orange-500" />
                          </button>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 font-medium">
                            {product.brand} • {getConditionLabel(product.condition)}
                          </p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-2xl font-bold text-green-900">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link
                              href={`/products/${product._id}`}
                              className="flex-1 text-center border-2 border-green-900 text-green-900 py-2 rounded-xl hover:bg-green-50 transition-colors font-semibold"
                            >
                              Détails
                            </Link>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-gradient-to-r from-green-900 to-green-800 text-white p-2 rounded-xl hover:from-green-800 hover:to-green-700 transition-all duration-200 hover:scale-105"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {products.map((product: Product) => (
                      <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 relative">
                            {product.images.length > 0 && (
                              <img
                                src={product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url}
                                alt={product.name}
                                className="w-full h-48 md:h-full object-cover"
                              />
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="bg-green-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {getCategoryLabel(product.category)}
                              </span>
                            </div>
                            {product.discountPercentage > 0 && (
                              <div className="absolute top-4 right-4">
                                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  -{product.discountPercentage}%
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="md:w-2/3 p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {product.name}
                              </h3>
                              <p className="text-gray-600 mb-4">
                                {product.brand} • {getConditionLabel(product.condition)}
                              </p>
                              <p className="text-gray-700 mb-4 line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-3xl font-bold text-green-900">
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-lg text-gray-500 line-through ml-3">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex space-x-3">
                                <Link
                                  href={`/products/${product._id}`}
                                  className="border-2 border-green-900 text-green-900 px-6 py-2 rounded-xl hover:bg-green-50 transition-colors font-semibold"
                                >
                                  Voir détails
                                </Link>
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="bg-gradient-to-r from-green-900 to-green-800 text-white px-6 py-2 rounded-xl hover:from-green-800 hover:to-green-700 transition-all duration-200 font-semibold"
                                >
                                  Ajouter au panier
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handleFilterChange('page', page)}
                        className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                          page === (pagination.currentPage || 1)
                            ? 'bg-green-900 text-white'
                            : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-8">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <button
                  onClick={() => setFilters({ sortBy: 'createdAt', sortOrder: 'desc' })}
                  className="bg-green-900 text-white px-8 py-3 rounded-xl hover:bg-green-800 transition-colors font-semibold"
                >
                  Voir tous les produits
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg text-gray-600">Chargement des produits...</div>
    </div>}>
      <ProductsContent />
    </Suspense>
  );
}