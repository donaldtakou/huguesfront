'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Shield, 
  Truck, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Package,
  ShoppingCart,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getCategoryLabel, getConditionLabel, getConditionColor } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import ProductImage from '@/components/ProductImage';
import { useAuth } from '@/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Chargement du produit:', id);
      
      const response = await fetch(`${API_URL}/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Produit introuvable');
        }
        throw new Error('Erreur lors du chargement');
      }
      
      const data = await response.json();
      console.log('✅ Produit chargé:', data);
      
      if (data && data.product) {
        setProduct(data.product);
      } else {
        throw new Error('Format de données invalide');
      }
      
    } catch (err: any) {
      console.error('❌ Erreur fetchProduct:', err);
      setError(err.message || 'Erreur lors du chargement du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Découvrez ${product?.name} sur FastDeal`,
          url: url,
        });
      } catch (err) {
        navigator.clipboard.writeText(url);
        toast.success('Lien copié !');
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Lien copié !');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/products/${id}`);
      return;
    }

    addItem(product);
    toast.success('Produit ajouté au panier !');
  };

  const calculateDiscount = () => {
    if (!product?.originalPrice || !product?.price) return 0;
    if (product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return 'Date inconnue';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-2xl h-96"></div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h1>
          <p className="text-gray-600 mb-6">{error || 'Ce produit n\'existe pas ou a été supprimé'}</p>
          <Link 
            href="/products"
            className="inline-block bg-gradient-to-r from-green-700 to-green-900 text-white px-6 py-3 rounded-xl hover:from-green-800 hover:to-green-950 transition-all"
          >
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount();
  const hasImages = product.images && product.images.length > 0;
  const currentImage = hasImages ? product.images[currentImageIndex] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-900">Accueil</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-green-900">Catalogue</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-green-900">
              {getCategoryLabel(product.category)}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              {hasImages ? (
                <>
                  <ProductImage
                    src={currentImage?.url}
                    alt={product.name}
                    className="w-full h-96"
                    category={product.category}
                  />
                  
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {hasImages && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-green-900 ring-2 ring-green-200' 
                        : 'border-gray-300 hover:border-green-600'
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
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <span className="bg-green-100 text-green-900 text-sm font-medium px-4 py-2 rounded-full">
                {getCategoryLabel(product.category)}
              </span>
              {product.condition && (
                <span className={`text-sm px-4 py-2 rounded-full font-medium ${getConditionColor(product.condition)}`}>
                  {getConditionLabel(product.condition)}
                </span>
              )}
              {product.availability === 'in-stock' && (
                <span className="bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full border border-green-200">
                  ✓ En stock
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <p className="text-lg text-gray-600">
                {product.brand}
                {product.model && <span> • {product.model}</span>}
              </p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-4xl font-bold text-green-900 mb-2">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center space-x-3">
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        -{discount}%
                      </span>
                    </div>
                  )}
                  {product.stock !== undefined && (
                    <p className="text-sm text-gray-600 mt-2">
                      Stock: {product.stock} unité{product.stock > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-full border-2 transition-all ${
                      isFavorite 
                        ? 'bg-red-50 border-red-500 text-red-600' 
                        : 'bg-white border-gray-300 text-gray-600 hover:border-red-300'
                    }`}
                    title="Ajouter aux favoris"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full border-2 bg-white border-gray-300 text-gray-600 hover:border-green-600 transition-all"
                    title="Partager"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-green-700 to-green-900 text-white py-4 rounded-xl font-bold text-lg hover:from-green-800 hover:to-green-950 transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
              >
                {isAuthenticated ? (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    <span>Ajouter au panier</span>
                  </>
                ) : (
                  <>
                    <User className="w-6 h-6" />
                    <span>Se connecter pour acheter</span>
                  </>
                )}
              </button>

              {isAuthenticated && user && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-green-800">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      Connecté: <span className="font-semibold">{user.firstName} {user.lastName}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Garanties et services</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Garantie vendeur 30 jours</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">Livraison disponible</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <RefreshCw className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <span className="text-sm">Retour sous conditions</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            {(product.views || product.createdAt) && (
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                {product.views !== undefined && (
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{product.views} vue{product.views > 1 ? 's' : ''}</span>
                  </div>
                )}
                {product.createdAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description and Seller */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description || 'Aucune description disponible.'}
              </p>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Caractéristiques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => {
                        if (!value) return null;
                        return (
                          <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 capitalize">{key}:</span>
                            <span className="font-medium text-gray-900">{String(value)}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vendeur</h3>
              
              {product.seller ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {product.seller.avatar?.url ? (
                      <img
                        src={product.seller.avatar.url}
                        alt={`${product.seller.firstName} ${product.seller.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-green-900" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {product.seller.firstName} {product.seller.lastName}
                      </p>
                      {product.seller.statistics && (
                        <p className="text-sm text-gray-600">
                          ⭐ {product.seller.statistics.averageRating?.toFixed(1) || 'N/A'} 
                          ({product.seller.statistics.totalReviews || 0} avis)
                        </p>
                      )}
                    </div>
                  </div>

                  {product.location && (
                    <div className="flex items-start space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span className="text-sm">
                        {product.location.city}
                        {product.location.country && `, ${product.location.country}`}
                      </span>
                    </div>
                  )}

                  {product.seller.phone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{product.seller.phone}</span>
                    </div>
                  )}

                  {product.seller.email && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm break-all">{product.seller.email}</span>
                    </div>
                  )}

                  <button className="w-full bg-green-100 text-green-900 py-3 rounded-xl font-semibold hover:bg-green-200 transition-colors">
                    Contacter le vendeur
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Informations vendeur non disponibles</p>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link 
            href="/products"
            className="inline-flex items-center space-x-2 text-green-900 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au catalogue</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
