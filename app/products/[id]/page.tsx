'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  Shield, 
  Truck, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Package,
  Smartphone,
  Monitor,
  Watch,
  Laptop,
  Tablet
} from 'lucide-react';
import Logo from '@/components/Logo';
import api from '@/lib/api';
import { formatPrice, getCategoryLabel, getConditionLabel, getConditionColor, formatDate } from '@/lib/utils';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'laptop':
        return <Laptop className="w-5 h-5" />;
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      case 'smartwatch':
        return <Watch className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Découvrez ce ${product.name} sur FastDeal`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié dans le presse-papiers');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <Logo size="md" />
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-lg h-96"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-20 w-20"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <Logo size="md" />
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit introuvable</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour au catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-blue-600 font-medium">
                Catalogue
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium">
                Catégories
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                À propos
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Connexion
              </Link>
              <Link 
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Accueil</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Catalogue</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-blue-600">
            {getCategoryLabel(product.category)}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
              {product.images.length > 0 ? (
                <div className="relative aspect-w-1 aspect-h-1">
                  <img
                    src={product.images[currentImageIndex]?.url}
                    alt={product.name}
                    className="w-full h-96 object-cover cursor-zoom-in"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                  
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-600' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category and Condition */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {getCategoryIcon(product.category)}
                <span className="text-sm font-medium">{getCategoryLabel(product.category)}</span>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${getConditionColor(product.condition)}`}>
                {getConditionLabel(product.condition)}
              </span>
            </div>

            {/* Title and Brand */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.brand} • {product.model}</p>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                        -{product.discountPercentage}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-full border ${
                      isFavorite ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-300 text-gray-600'
                    } hover:scale-105 transition-transform`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full border bg-white border-gray-300 text-gray-600 hover:scale-105 transition-transform"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contacter le vendeur
              </button>
              <button className="w-full border border-blue-600 text-blue-600 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Ajouter au panier
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Garanties et services</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Garantie vendeur 30 jours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Livraison gratuite dès 50€</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-gray-700">Retour gratuit sous 14 jours</span>
                </div>
              </div>
            </div>

            {/* Product Stats */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{product.views} vues</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Publié le {formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description and Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Caractéristiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Marque</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modèle</span>
                  <span className="font-medium">{product.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">État</span>
                  <span className="font-medium">{getConditionLabel(product.condition)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Catégorie</span>
                  <span className="font-medium">{getCategoryLabel(product.category)}</span>
                </div>
                {product.specifications.storage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stockage</span>
                    <span className="font-medium">{product.specifications.storage}</span>
                  </div>
                )}
                {product.specifications.color && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Couleur</span>
                    <span className="font-medium">{product.specifications.color}</span>
                  </div>
                )}
                {product.specifications.screenSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taille écran</span>
                    <span className="font-medium">{product.specifications.screenSize}</span>
                  </div>
                )}
                {product.specifications.processor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processeur</span>
                    <span className="font-medium">{product.specifications.processor}</span>
                  </div>
                )}
                {product.specifications.ram && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">RAM</span>
                    <span className="font-medium">{product.specifications.ram}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vendeur</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {product.seller?.firstName?.[0] || 'V'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {product.seller?.firstName || 'Vendeur'} {product.seller?.lastName || ''}
                    </div>
                    <div className="text-sm text-gray-500">Membre depuis 2024</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.8 (125 avis)</span>
                </div>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Voir le profil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && product.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-full">
            <img
              src={product.images[currentImageIndex]?.url}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}