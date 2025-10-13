'use client';

import { useState } from 'react';
import { Package, Smartphone, Laptop, Tablet, Watch } from 'lucide-react';

interface SimpleProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  category?: string;
}

export default function SimpleProductImage({ 
  src, 
  alt, 
  className = "",
  category
}: SimpleProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

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

  // Si pas d'image source ou erreur de chargement, afficher le fallback avec icône
  if (!src || imageError) {
    const Icon = getCategoryIcon();
    const colorClass = getCategoryColor();
    
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br ${colorClass} ${className}`}>
        <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
          <Icon className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-2 opacity-90" />
          <p className="text-xs sm:text-sm font-medium text-center opacity-90">
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Produit'}
          </p>
          <p className="text-xs opacity-75 mt-1">Image non disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center animate-pulse">
          <div className="text-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
            <div className="h-2 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
          </div>
        </div>
      )}
      
      {/* Image principale */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}