'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Package, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks';
import { useProducts } from '@/hooks';
import { formatPrice, getCategoryLabel, getConditionLabel, formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { products: userProducts, isLoading } = useProducts({
    seller: user?._id,
    limit: 10
  });

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    totalEarnings: 0,
    activeOrders: 0
  });

  useEffect(() => {
    if (userProducts) {
      const totalViews = userProducts.reduce((sum, product) => sum + product.views, 0);
      const totalEarnings = userProducts.reduce((sum, product) => 
        sum + (product.status === 'sold' ? product.price : 0), 0
      );
      
      setStats({
        totalProducts: userProducts.length,
        totalViews,
        totalEarnings,
        activeOrders: userProducts.filter(p => p.status === 'sold').length
      });
    }
  }, [userProducts]);

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'products', label: 'Mes produits', icon: Package },
    { id: 'orders', label: 'Mes commandes', icon: ShoppingBag },
    { id: 'favorites', label: 'Favoris', icon: Heart },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Bonjour {user?.firstName} 👋
        </h2>
        <p className="text-blue-100">
          Bienvenue sur votre tableau de bord FastDeal
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalProducts}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Produits en vente</h3>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalViews}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Vues totales</h3>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalEarnings)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Revenus totaux</h3>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.activeOrders}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Ventes réalisées</h3>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Produits récents</h3>
            <Link 
              href="/dashboard?tab=products"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir tout
            </Link>
          </div>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : userProducts.length > 0 ? (
            <div className="space-y-4">
              {userProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    {product.images.length > 0 && (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatPrice(product.price)}</span>
                      <span>{product.views} vues</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'active' ? 'En vente' :
                         product.status === 'sold' ? 'Vendu' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/products/${product._id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun produit</h4>
              <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore publié de produits</p>
              <Link
                href="/sell"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Vendre un produit
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mes produits</h2>
        <Link
          href="/sell"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un produit</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : userProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Produit</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Prix</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-500">État</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Vues</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {product.images.length > 0 && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {getCategoryLabel(product.category)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">{formatPrice(product.price)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'active' ? 'En vente' :
                         product.status === 'sold' ? 'Vendu' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-4 px-6">{product.views}</td>
                    <td className="py-4 px-6 text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="text-gray-600 hover:text-gray-700">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit</h3>
            <p className="text-gray-500 mb-6">Vous n&apos;avez pas encore publié de produits</p>
            <Link
              href="/sell"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Publier votre premier produit
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mon profil</h2>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-2xl">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500">
              Membre depuis {user?.createdAt ? formatDate(user.createdAt) : 'Non disponible'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <input
              type="text"
              defaultValue={user?.firstName}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              defaultValue={user?.lastName}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              defaultValue={user?.phone}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4">
            Sauvegarder
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'products':
        return renderProducts();
      case 'orders':
        return <div>Mes commandes - À venir</div>;
      case 'favorites':
        return <div>Mes favoris - À venir</div>;
      case 'profile':
        return renderProfile();
      case 'settings':
        return <div>Paramètres - À venir</div>;
      default:
        return renderOverview();
    }
  };

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
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
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
              <span className="text-gray-700">
                Bonjour, {user?.firstName}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 font-medium flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}