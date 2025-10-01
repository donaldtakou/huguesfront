'use client';

import Link from 'next/link';
import { Shield, Users, Award, Target, Heart, Truck, CheckCircle, Star } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Confiance',
      description: 'Chaque produit est rigoureusement testé et certifié par nos experts techniques.',
      color: 'from-green-900 to-green-800'
    },
    {
      icon: Award,
      title: 'Qualité',
      description: 'Nous sélectionnons uniquement les meilleurs produits d\'occasion du marché.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Une communauté de +25 000 membres qui partagent notre vision du numérique durable.',
      color: 'from-green-900 to-green-800'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Nous réinventons l\'achat et la vente d\'électronique avec une expérience premium.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Produits vendus', icon: CheckCircle },
    { number: '25K+', label: 'Clients satisfaits', icon: Users },
    { number: '4.8/5', label: 'Note moyenne', icon: Star },
    { number: '99%', label: 'Satisfaction client', icon: Heart }
  ];

  const team = [
    {
      name: 'Ngouho Hugues',
      role: 'CEO & Fondateur',
      description: 'Expert en technologie avec 10 ans d\'expérience dans l\'e-commerce.'
    },
    {
      name: 'Ngouhouo Donald',
      role: 'CTO',
      description: 'Développeur passionnée, architecte de notre plateforme innovante.'
    },
    {
      name: 'Thomas Bernard',
      role: 'Responsable Qualité',
      description: 'Garant de la qualité de chaque produit vendu sur FastDeal.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Notre Mission
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Démocratiser l'accès à l'électronique premium tout en 
              <span className="text-orange-400 font-semibold"> révolutionnant le marché de l'occasion</span>
            </p>
            <div className="inline-flex items-center bg-green-800/50 backdrop-blur-sm px-6 py-3 rounded-full text-green-100 border border-green-600/30">
              <Heart className="w-5 h-5 mr-2 text-orange-400" />
              Fondé en 2023 avec passion
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Pourquoi FastDeal existe ?
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <span className="font-semibold text-green-900">FastDeal</span> est né d'un constat simple : 
                  l'électronique d'occasion manque cruellement de confiance et de professionnalisme.
                </p>
                <p>
                  Nous avons créé la première plateforme qui combine la rigueur du neuf avec 
                  l'accessibilité de l'occasion, en garantissant une expérience d'achat premium.
                </p>
                <p>
                  Chaque produit est <span className="font-semibold text-orange-500">minutieusement testé</span>, 
                  vérifié et certifié par nos experts pour vous offrir la tranquillité d'esprit que vous méritez.
                </p>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/products"
                  className="inline-flex items-center bg-gradient-to-r from-green-900 to-green-800 text-white px-8 py-4 rounded-2xl hover:from-green-800 hover:to-green-700 transition-all duration-200 font-bold shadow-xl hover:scale-105"
                >
                  Découvrir nos produits
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                          <Icon className={`w-8 h-8 ${index % 2 === 0 ? 'text-green-900' : 'text-orange-500'}`} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                        <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident chacune de nos actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des experts passionnés au service de votre satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className={`w-20 h-20 bg-gradient-to-r ${index % 2 === 0 ? 'from-green-900 to-green-800' : 'from-orange-500 to-orange-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-orange-500 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Processus Qualité
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comment nous garantissons l'excellence de chaque produit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Réception & Inspection',
                description: 'Chaque produit est minutieusement inspecté visuellement et techniquement par nos experts.',
                color: 'from-green-900 to-green-800'
              },
              {
                step: '02',
                title: 'Tests & Certification',
                description: 'Batterie de tests approfondis pour valider le bon fonctionnement de tous les composants.',
                color: 'from-orange-500 to-orange-600'
              },
              {
                step: '03',
                title: 'Reconditionnement',
                description: 'Nettoyage professionnel et remplacement des pièces défectueuses si nécessaire.',
                color: 'from-green-900 to-green-800'
              }
            ].map((process, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 bg-gradient-to-r ${process.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <span className="text-white text-xl font-bold">{process.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{process.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{process.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-900 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez l'aventure FastDeal
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Découvrez une nouvelle façon d'acheter et vendre votre électronique
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-green-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-xl hover:scale-105"
            >
              Commencer mes achats
            </Link>
            <Link
              href="/sell"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-green-900 transition-all duration-200 hover:scale-105"
            >
              Vendre mes produits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}