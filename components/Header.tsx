'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart,
  Settings,
  LogOut,
  Plus,
  Bell,
  ChevronDown
} from 'lucide-react';
import Logo from './Logo';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { items, getTotalItems, getTotalPrice, toggleCart } = useCartStore();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Produits', href: '/products' },
    { name: 'Catégories', href: '/categories' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const totalItems = isHydrated ? getTotalItems() : 0;

  // Fermer les menus si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };
    
    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'
    } ${className}`}>
      <div className="border-b border-gray-200">
        {/* Container principal responsive */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Logo - Responsive */}
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <Logo size="md" className="h-8 w-auto sm:h-10 lg:h-12" />
              </Link>
            </div>

            {/* Navigation Desktop - Cachée sur mobile/tablette */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-700 hover:text-green-900 transition-colors font-medium text-sm xl:text-base group px-2 py-1"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-900 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Barre de recherche Desktop */}
            <div className="hidden lg:flex flex-1 max-w-sm xl:max-w-md mx-6 xl:mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des produits..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-900 focus:border-transparent transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Actions droite - Optimisées pour mobile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Panier - Toujours visible */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 text-gray-700 hover:text-green-900 transition-colors rounded-lg hover:bg-gray-100"
                aria-label={`Panier (${totalItems} articles)`}
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {isHydrated && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Menu utilisateur ou bouton connexion */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-green-900 transition-colors rounded-lg hover:bg-gray-100"
                    aria-label="Menu utilisateur"
                  >
                    <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 hidden sm:block" />
                  </button>
                  
                  {/* Dropdown menu utilisateur */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      >
                        <User className="w-4 h-4" />
                        <span>Tableau de bord</span>
                      </Link>
                      
                      <Link
                        href="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Paramètres</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="bg-green-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-green-800 transition-colors font-medium text-sm whitespace-nowrap flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden xs:inline">Se connecter</span>
                  <span className="xs:hidden">Connexion</span>
                </Link>
              )}

              {/* Bouton menu mobile - Amélioré */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 text-gray-700 hover:text-green-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 ml-1"
                aria-label="Menu de navigation"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Barre de recherche mobile */}
          <div className="lg:hidden pb-4 px-1">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits..."
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-900 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Menu de navigation mobile - Responsive amélioré */}
        <div className={`lg:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
            
            {/* Liens de navigation */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-white hover:bg-green-900 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-green-900 text-base"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Menu utilisateur connecté */}
            {user && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-white hover:bg-green-900 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-green-900"
                  >
                    📊 Mon tableau de bord
                  </Link>
                  <Link
                    href="/sell"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-white hover:bg-green-900 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-green-900"
                  >
                    💰 Vendre un produit
                  </Link>
                </div>
              </div>
            )}

            {/* Actions rapides */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="space-y-3">
                {!user && (
                  <Link
                    href="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 bg-green-900 text-white rounded-xl hover:bg-green-800 transition-colors font-medium"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Se connecter
                  </Link>
                )}
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  📞 Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;