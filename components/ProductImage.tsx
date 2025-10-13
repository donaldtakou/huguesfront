'use client';

import { useState, useEffect } from 'react';
import { Package, Smartphone, Laptop, Tablet, Watch } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
  priority?: boolean;
  quality?: number;
  category?: string;
}

export default function ProductImage({ 
  src, 
  alt, 
  className = "",
  category
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Transformer l'URL si nécessaire pour corriger les problèmes de CORS
  const getImageSrc = (originalSrc?: string) => {
    if (!originalSrc) return undefined;
    
    // Si l'URL est déjà complète (http://), la garder telle quelle
    if (originalSrc.startsWith('http://') || originalSrc.startsWith('https://')) {
      return originalSrc;
    }
    
    // Si l'URL commence par /uploads/, ajouter le préfixe du serveur backend
    if (originalSrc.startsWith('/uploads/')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${backendUrl}${originalSrc}`;
    }
    
    // Pour les autres URLs relatives, les garder telles quelles
    return originalSrc;
  };
  
  const processedSrc = getImageSrc(src);
  
  // Debug pour comprendre ce qui se passe
  useEffect(() => {
    console.log('🔍 ProductImage Debug:', {
      originalSrc: src,
      processedSrc,
      alt,
      category,
      imageError,
      imageLoading,
      component: 'ProductImage'
    });
    
    // Log spécial pour les URLs localhost:5000
    if (src && src.includes('localhost:5000')) {
      console.log('🎯 Backend URL detected:', src, '→ Transformed to:', processedSrc);
    }
  }, [src, processedSrc, alt, category, imageError, imageLoading]);

  // Fonction pour obtenir l'icône selon la catégorie
  const getCategoryIcon = () => {
    switch (category?.toLowerCase()) {
      case 'smartphone':
        return Smartphone;
      case 'laptop':
        return Laptop;
      case 'tablet':
        return Tablet;
      case 'smartwatch':
        return Watch;
      default:
        return Package;
    }
  };

  // Fonction pour obtenir la couleur selon la catégorie
  const getCategoryColor = () => {
    switch (category?.toLowerCase()) {
      case 'smartphone':
        return 'from-green-400 to-green-600';
      case 'laptop':
        return 'from-blue-400 to-blue-600';
      case 'tablet':
        return 'from-purple-400 to-purple-600';
      case 'smartwatch':
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  // Fonction pour obtenir le nom de la catégorie
  const getCategoryName = () => {
    switch (category?.toLowerCase()) {
      case 'smartphone':
        return 'Smartphone';
      case 'laptop':
        return 'Ordinateur';
      case 'tablet':
        return 'Tablette';
      case 'smartwatch':
        return 'Montre';
      default:
        return 'Produit';
    }
  };

  // Si pas d'image source ou erreur de chargement, afficher le fallback avec icône
  if (!processedSrc || imageError) {
    console.log('🚨 ProductImage Fallback:', { 
      originalSrc: src,
      processedSrc, 
      imageError, 
      category,
      reason: !processedSrc ? 'No src provided' : 'Image failed to load'
    });
    
    const Icon = getCategoryIcon();
    const colorClass = getCategoryColor();
    const categoryName = getCategoryName();
    
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br ${colorClass} ${className}`}>
        <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
          <Icon className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-2 opacity-90" />
          <p className="text-xs sm:text-sm font-medium text-center opacity-90">
            {categoryName}
          </p>
          <p className="text-xs opacity-75 mt-1 text-center">Image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>      
      {/* Loading placeholder */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center animate-pulse z-10">
          <div className="text-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
            <div className="h-2 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
          </div>
        </div>
      )}
      
      {/* Image principale */}
      <img
        src={processedSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        } ${processedSrc?.endsWith('.svg') ? 'object-contain bg-white' : 'object-cover'}`}
        onLoad={() => {
          console.log('✅ Image loaded successfully:', processedSrc);
          setImageLoading(false);
        }}
        onError={() => {
          console.error('❌ Image failed to load:', processedSrc);
          setImageError(true);
          setImageLoading(false);
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}