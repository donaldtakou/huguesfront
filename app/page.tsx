'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Star, Shield, Truck, RefreshCw, Users, Award, Smartphone, Laptop, Tablet, Watch, Package, Plus, TrendingUp, Eye, CheckCircle } from 'lucide-react';
import { useProducts } from '@/hooks';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getCategoryLabel, getConditionLabel } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { CONTACT_INFO } from '@/lib/demoData';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { products: featuredProducts, isLoading } = useProducts({ limit: 8, featured: true });
  const { addItem } = useCartStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success('Produit ajouté au panier !');
  };

  const categories = [
    { name: 'Smartphones', icon: Smartphone, href: '/products?category=smartphone', color: 'from-green-900 to-green-800', count: '2.5k+' },
    { name: 'Ordinateurs', icon: Laptop, href: '/products?category=laptop', color: 'from-orange-500 to-orange-600', count: '1.2k+' },
    { name: 'Tablettes', icon: Tablet, href: '/products?category=tablet', color: 'from-green-900 to-green-800', count: '800+' },
    { name: 'Montres', icon: Watch, href: '/products?category=smartwatch', color: 'from-orange-500 to-orange-600', count: '600+' },
  ];

  const stats = [
    { number: '50K+', label: 'Produits vendus', icon: Package, color: 'text-green-900' },
    { number: '25K+', label: 'Clients satisfaits', icon: Users, color: 'text-orange-500' },
    { number: '4.8/5', label: 'Note moyenne', icon: Star, color: 'text-orange-500' },
    { number: '99%', label: 'Satisfaction client', icon: CheckCircle, color: 'text-green-900' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Import sécurisé USA/Canada',
      description: 'Importation directe depuis nos fournisseurs vérifiés aux États-Unis et au Canada.',
      color: 'from-green-900 to-green-800'
    },
    {
      icon: Truck,
      title: 'Livraison en Afrique de l\'Ouest',
      description: 'Livraison rapide et sécurisée dans toute l\'Afrique de l\'Ouest sous 14 jours.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: RefreshCw,
      title: 'Garantie produit',
      description: 'Tous nos produits importés sont garantis et authentiques avec certificat d\'origine.',
      color: 'from-green-900 to-green-800'
    },
    {
      icon: Award,
      title: 'Qualité USA/Canada',
      description: 'Électronique premium importée directement des meilleurs marchés nord-américains.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const testimonials = [
    {
      name: "Amadou D.",
      location: "Dakar, Sénégal",
      rating: 5,
      comment: "Excellent service ! Mon iPhone importé des USA est arrivé parfaitement emballé. Prix très compétitif par rapport à l'import personnel.",
      product: "iPhone 15 Pro Max",
      verified: true
    },
    {
      name: "Fatou K.",
      location: "Abidjan, Côte d'Ivoire",
      rating: 5,
      comment: "FastDeal m'a fait économiser beaucoup sur mon MacBook. Import rapide du Canada, communication excellente tout au long du process.",
      product: "MacBook Air M3",
      verified: true
    },
    {
      name: "Ibrahim T.",
      location: "Bamako, Mali",
      rating: 5,
      comment: "Service professionnel pour l'import de ma tablette. Dédouanement géré par eux, livraison directe à domicile en 12 jours.",
      product: "iPad Pro 11",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 sm:top-32 right-10 sm:right-20 w-24 h-24 sm:w-32 sm:h-32 bg-green-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative container-responsive py-8 sm:py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div>
              {/* Badge - Mobile Optimized */}
              <div className="inline-flex items-center bg-green-800/50 backdrop-blur-sm px-3 py-2 rounded-full text-green-100 text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-green-600/30">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="hidden sm:inline">#1 Importateur électronique USA/Canada vers l'Afrique de l'Ouest</span>
                <span className="sm:hidden">Import USA/Canada</span>
              </div>
              
              {/* Main Heading - Responsive Typography */}
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                Électronique premium 
                <span className="block sm:inline bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"> 
                  USA & Canada
                </span>
              </h1>
              
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-green-100 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                Importez facilement smartphones, tablettes, ordinateurs et montres connectées directement des États-Unis et du Canada. 
                <span className="block sm:inline text-orange-300 font-semibold">Qualité nord-américaine, prix FCFA attractifs.</span>
              </p>
              
              {/* Search Bar - Mobile First */}
              <form onSubmit={handleSearch} className="mb-4 sm:mb-6 lg:mb-8">
                <div className="relative w-full max-w-lg">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="iPhone, MacBook, Samsung..."
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base text-gray-900 bg-white/95 backdrop-blur-sm placeholder-gray-500 border-none rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/50 shadow-2xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 sm:top-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </form>

              {/* CTA Buttons - Mobile Stack */}
              <div className="flex flex-col xs:flex-row gap-3 mb-4 sm:mb-6 lg:mb-8">
                <Link
                  href="/products"
                  className="group bg-white text-green-900 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-105 text-sm sm:text-base flex-1"
                >
                  <span>Explorer le catalogue</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`tel:${CONTACT_INFO.supplier}`}
                  className="group border-2 border-white text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-white hover:text-green-900 transition-all duration-200 text-center backdrop-blur-sm hover:scale-105 text-sm sm:text-base flex-1"
                >
                  Demander un devis
                </a>
              </div>
              
              {/* Trust Indicators - Mobile Wrap */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-green-100">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="text-xs sm:text-sm font-medium">Import sécurisé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-orange-500" />
                  <span className="text-xs sm:text-sm font-medium">Livraison 14 jours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span className="text-xs sm:text-sm font-medium">Garantie USA/Canada</span>
                </div>
              </div>
            </div>
            
            {/* Product Showcase - Hidden on small mobile, responsive grid */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {[
                  { name: 'iPhone 15 Pro Max', price: 'dès 850.000 FCFA', icon: Smartphone, gradient: 'from-orange-500 to-orange-600', saving: 'USA' },
                  { name: 'MacBook Air M3', price: 'dès 980.000 FCFA', icon: Laptop, gradient: 'from-green-900 to-green-800', saving: 'Canada' },
                  { name: 'iPad Pro 11"', price: 'dès 750.000 FCFA', icon: Tablet, gradient: 'from-orange-500 to-orange-600', saving: 'USA' },
                  { name: 'Apple Watch Ultra', price: 'dès 450.000 FCFA', icon: Watch, gradient: 'from-green-900 to-green-800', saving: 'Canada' }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={i}
                      href="/products"
                      className="group bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.saving}
                      </div>
                      
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${item.gradient} rounded-lg lg:rounded-xl mb-3 lg:mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      
                      <h3 className="font-semibold mb-2 text-white text-sm lg:text-base">{item.name}</h3>
                      <p className="text-green-100 text-xs lg:text-sm font-medium mb-2 lg:mb-3">{item.price}</p>
                      
                      <div className="text-xs text-green-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        Voir les offres
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16 text-gray-50">
            <path fill="currentColor" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explorez nos catégories d'import
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trouvez exactement ce que vous cherchez parmi notre sélection premium d'appareils importés des USA et du Canada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4 font-medium">{category.count} produits disponibles</p>
                  
                  <div className="flex items-center text-green-900 font-semibold group-hover:text-green-700">
                    <span>Découvrir</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Produits en vedette
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez notre sélection coup de cœur
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center space-x-2 bg-green-900 text-white px-6 py-3 rounded-xl hover:bg-green-800 font-semibold transition-colors"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.slice(0, 8).map((product: any) => (
                <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
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
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                    )}
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
              )) || []}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-900 to-green-800 text-white px-8 py-4 rounded-2xl hover:from-green-800 hover:to-green-700 transition-all duration-200 font-bold text-lg hover:scale-105 shadow-xl"
            >
              <span>Voir tous les produits</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir FastDeal Import ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous facilitons l'importation d'électronique premium depuis l'Amérique du Nord vers l'Afrique de l'Ouest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Plus de 1 200 clients satisfaits en Afrique de l'Ouest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="ml-3 bg-green-100 text-green-900 text-xs font-medium px-2 py-1 rounded-full">
                      Achat vérifié
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location} • {testimonial.product}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Rejoignez la révolution 
            <span className="text-orange-400"> Import FastDeal</span>
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Contactez-nous maintenant pour votre première commande et bénéficiez de 
            <span className="text-orange-300 font-bold"> frais de dédouanement offerts </span>
            pour tout import supérieur à 500 000 FCFA
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${CONTACT_INFO.supplier}`}
              className="bg-white text-green-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-xl hover:scale-105 text-center"
            >
              Appeler maintenant: {CONTACT_INFO.supplier}
            </a>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-green-900 transition-all duration-200 backdrop-blur-sm hover:scale-105 text-center"
            >
              WhatsApp Business
            </a>
          </div>
          
          <div className="mt-8 text-green-200 text-sm">
            ✓ Consultation gratuite • ✓ Devis personnalisé • ✓ Support 7j/7
          </div>
        </div>
      </section>
    </div>
  );
}