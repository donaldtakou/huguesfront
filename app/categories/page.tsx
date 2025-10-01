'use client';

import Link from 'next/link';
import { ArrowRight, Package, Smartphone, Laptop, Tablet, Watch, Headphones, Monitor } from 'lucide-react';
import { useCategories } from '@/hooks/useProducts';

export default function CategoriesPage() {
  const { categories, isLoading } = useCategories();

  const categoryIcons = {
    smartphone: Smartphone,
    laptop: Laptop,
    tablet: Tablet,
    smartwatch: Watch,
    accessory: Headphones,
    desktop: Monitor
  };

  const categoryColors = {
    smartphone: 'from-green-900 to-green-800',
    laptop: 'from-orange-500 to-orange-600',
    tablet: 'from-green-900 to-green-800',
    smartwatch: 'from-orange-500 to-orange-600',
    accessory: 'from-green-900 to-green-800',
    desktop: 'from-orange-500 to-orange-600'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-900 to-green-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nos Catégories
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                Découvrez notre gamme complète d'électronique importée des États-Unis et du Canada
              </p>
            </div>
          </div>
        </section>

        {/* Loading */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos Catégories
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Découvrez notre gamme complète d'électronique importée directement des 
              <span className="text-orange-400 font-semibold"> États-Unis et du Canada</span>
            </p>
            <div className="inline-flex items-center bg-green-800/50 backdrop-blur-sm px-6 py-3 rounded-full text-green-100 border border-green-600/30">
              <Package className="w-5 h-5 mr-2 text-orange-400" />
              Import direct • Garantie internationale
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Package;
              const colorClass = categoryColors[category.id as keyof typeof categoryColors] || 'from-green-900 to-green-800';
              
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                    <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-900">
                        {category.productCount}+ produits
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-900 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {category.productCount} produits disponibles
                      </div>
                      <div className="flex items-center text-green-900 font-semibold group-hover:text-orange-500 transition-colors">
                        <span className="mr-2">Explorer</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Import Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Import Direct USA/Canada
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous importons directement depuis les meilleurs fournisseurs américains et canadiens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Qualité Garantie',
                description: 'Produits neufs et reconditionnés certifiés par nos partenaires nord-américains',
                icon: '🏆'
              },
              {
                title: 'Prix Attractifs',
                description: 'Économisez jusqu\'à 40% par rapport aux prix locaux grâce à notre import direct',
                icon: '💰'
              },
              {
                title: 'Livraison Afrique',
                description: 'Livraison dans toute l\'Afrique de l\'Ouest avec suivi international',
                icon: '🌍'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Catégories Populaires
            </h2>
            <p className="text-xl text-gray-600">
              Les plus demandées en Afrique de l'Ouest
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'iPhone', category: 'smartphone', count: '25+' },
              { name: 'MacBook', category: 'laptop', count: '15+' },
              { name: 'iPad', category: 'tablet', count: '12+' },
              { name: 'AirPods', category: 'accessory', count: '30+' }
            ].map((item, index) => (
              <Link
                key={index}
                href={`/products?search=${item.name}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${
                  index % 2 === 0 ? 'from-green-900 to-green-800' : 'from-orange-500 to-orange-600'
                } rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-white text-2xl font-bold">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.count} modèles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-900 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Contactez notre équipe pour une commande spéciale depuis les USA/Canada
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+12067869764"
              className="bg-white text-green-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-xl hover:scale-105"
            >
              Appeler +1(206)786-9764
            </a>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-green-900 transition-all duration-200 hover:scale-105"
            >
              Demande personnalisée
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}