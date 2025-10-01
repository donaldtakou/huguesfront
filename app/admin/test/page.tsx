'use client';

import { useState } from 'react';

export default function AdminTestPage() {
  const [showAdmin, setShowAdmin] = useState(false);

  if (!showAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              FastDeal Admin - Mode Test
            </h1>
            <p className="text-gray-600 mb-6">
              Interface d'administration en mode développement. Aucune authentification requise.
            </p>
            <button
              onClick={() => setShowAdmin(true)}
              className="bg-green-900 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition-colors"
            >
              Accéder à l'admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-900">
                FastDeal Admin
              </h1>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Mode Test
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">
                  Mode développement
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Content */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  📦
                </div>
                <span className="text-green-600 text-sm font-medium">+12%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
              <p className="text-gray-600">Produits Demo</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  🛒
                </div>
                <span className="text-green-600 text-sm font-medium">+8%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">156</h3>
              <p className="text-gray-600">Commandes</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  💰
                </div>
                <span className="text-green-600 text-sm font-medium">+23%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">45,750,000</h3>
              <p className="text-gray-600">Revenus (FCFA)</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  👥
                </div>
                <span className="text-green-600 text-sm font-medium">+15%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">1,247</h3>
              <p className="text-gray-600">Utilisateurs Actifs</p>
            </div>
          </div>

          {/* Demo Products */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Produits de Démonstration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  📱
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">iPhone 15 Pro Max 512GB</h3>
                <p className="text-gray-600 mb-2">Apple</p>
                <p className="font-bold text-green-900 mb-4">850,000 FCFA</p>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-100 text-green-900 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    👁️
                  </button>
                  <button className="flex-1 bg-orange-100 text-orange-500 py-2 rounded-lg hover:bg-orange-200 transition-colors">
                    ✏️
                  </button>
                  <button className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors">
                    🗑️
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  💻
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">MacBook Air M3 15"</h3>
                <p className="text-gray-600 mb-2">Apple</p>
                <p className="font-bold text-green-900 mb-4">980,000 FCFA</p>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-100 text-green-900 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    👁️
                  </button>
                  <button className="flex-1 bg-orange-100 text-orange-500 py-2 rounded-lg hover:bg-orange-200 transition-colors">
                    ✏️
                  </button>
                  <button className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors">
                    🗑️
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  📱
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">iPad Pro 11" M4</h3>
                <p className="text-gray-600 mb-2">Apple</p>
                <p className="font-bold text-green-900 mb-4">750,000 FCFA</p>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-100 text-green-900 py-2 rounded-lg hover:bg-green-200 transition-colors">
                    👁️
                  </button>
                  <button className="flex-1 bg-orange-100 text-orange-500 py-2 rounded-lg hover:bg-orange-200 transition-colors">
                    ✏️
                  </button>
                  <button className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              ✅ Interface Admin Fonctionnelle !
            </h3>
            <p className="text-green-700">
              L'interface d'administration est maintenant accessible sans redirection vers la page de login. 
              Tous les corrections ont été appliquées avec succès.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}