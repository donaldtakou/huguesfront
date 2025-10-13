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
  ChevronDown,
  BarChart3,
  DollarSign,
  Phone
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
        {/* Container principal ultra-responsive */}
        <div className="max-w-7xl mx-auto px-2 xxs:px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 xxs:h-14 sm:h-16 lg:h-18">
            
            {/* Logo - Optimisé pour très petits écrans */}
            <div className="flex-shrink-0 mr-2 xxs:mr-3 sm:mr-4 lg:mr-6">
              <Link href="/" className="block">
                <Logo size="md" className="h-5 xxs:h-6 xs:h-7 sm:h-8 lg:h-10 w-auto" />
              </Link>
            </div>

            {/* Navigation Desktop - Cachée sur mobile/tablette */}
            <nav className="hidden xl:flex items-center space-x-4 2xl:space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-700 hover:text-green-900 transition-colors font-medium text-sm 2xl:text-base group px-2 py-1"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-900 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Barre de recherche Desktop */}
            <div className="hidden xl:flex flex-1 max-w-xs 2xl:max-w-sm mx-3 2xl:mx-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-900 focus:border-transparent transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Actions droite - Ultra-optimisées pour tous les mobiles */}
            <div className="flex items-center space-x-0.5 xxs:space-x-1 xs:space-x-1.5 sm:space-x-2">
              
              {/* Recherche mobile - Plus compact */}
              <button
                onClick={() => {/* Ouvrir modal de recherche */}}
                className="xl:hidden p-1 xxs:p-1.5 xs:p-2 text-gray-700 hover:text-green-900 transition-colors rounded-md hover:bg-gray-100"
                aria-label="Rechercher"
              >
                <Search className="w-4 h-4 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5" />
              </button>
              
              {/* Panier - Ultra-responsive avec badge optimisé */}
              <button
                onClick={toggleCart}
                className="relative p-1 xxs:p-1.5 xs:p-2 text-gray-700 hover:text-green-900 transition-colors rounded-md hover:bg-gray-100"
                aria-label={`Panier (${totalItems} articles)`}
              >
                <ShoppingCart className="w-4 h-4 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                {isHydrated && totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 xxs:-top-1 xxs:-right-1 bg-orange-500 text-white text-[9px] xxs:text-[10px] xs:text-xs font-bold rounded-full w-3 h-3 xxs:w-3.5 xxs:h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Menu utilisateur ou bouton connexion - Ultra-compact */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-0.5 xxs:space-x-1 p-1 xxs:p-1.5 xs:p-2 text-gray-700 hover:text-green-900 transition-colors rounded-md hover:bg-gray-100"
                    aria-label="Menu utilisateur"
                  >
                    <div className="w-5 h-5 xxs:w-6 xxs:h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] xxs:text-xs xs:text-sm font-medium">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <ChevronDown className="w-2.5 h-2.5 xxs:w-3 xxs:h-3 xs:w-4 xs:h-4 hidden xs:block" />
                  </button>
                  
                  {/* Dropdown menu utilisateur - Responsive */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-1 xxs:mt-2 w-48 xxs:w-52 xs:w-56 bg-white rounded-lg xxs:rounded-xl shadow-lg border border-gray-200 py-1 xxs:py-2 z-50">
                      <div className="px-3 xxs:px-4 py-2 xxs:py-3 border-b border-gray-100">
                        <p className="text-xs xxs:text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] xxs:text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 xxs:space-x-3 px-3 xxs:px-4 py-1.5 xxs:py-2 text-gray-700 hover:bg-gray-50 transition-colors text-xs xxs:text-sm"
                      >
                        <User className="w-3 h-3 xxs:w-4 xxs:h-4" />
                        <span>Tableau de bord</span>
                      </Link>
                      
                      <Link
                        href="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 xxs:space-x-3 px-3 xxs:px-4 py-1.5 xxs:py-2 text-gray-700 hover:bg-gray-50 transition-colors text-xs xxs:text-sm"
                      >
                        <Settings className="w-3 h-3 xxs:w-4 xxs:h-4" />
                        <span>Paramètres</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 xxs:space-x-3 px-3 xxs:px-4 py-1.5 xxs:py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left text-xs xxs:text-sm"
                      >
                        <LogOut className="w-3 h-3 xxs:w-4 xxs:h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="bg-green-900 text-white px-1.5 xxs:px-2 xs:px-2.5 sm:px-3 py-1 xxs:py-1.5 xs:py-2 rounded-md xxs:rounded-lg hover:bg-green-800 transition-colors font-medium text-[10px] xxs:text-xs xs:text-sm whitespace-nowrap flex items-center space-x-0.5 xxs:space-x-1"
                >
                  <User className="w-3 h-3 xxs:w-3 xxs:h-3 xs:w-4 xs:h-4" />
                  <span className="hidden xxs:inline">Connexion</span>
                </Link>
              )}

              {/* Bouton menu mobile - Ultra-compact et responsive */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="xl:hidden p-1 xxs:p-1.5 xs:p-2 text-gray-700 hover:text-green-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 ml-1 xxs:ml-1.5 xs:ml-2"
                aria-label="Menu de navigation"
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5" />
                ) : (
                  <Menu className="w-4 h-4 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Barre de recherche mobile - Ultra-responsive pour tous les écrans */}
          <div className="xl:hidden pb-2 xxs:pb-3 px-2 xxs:px-3 sm:px-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2 xxs:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-7 xxs:pl-8 xs:pl-10 pr-3 xxs:pr-4 py-2 xxs:py-2.5 xs:py-3 text-xs xxs:text-sm xs:text-base border border-gray-300 rounded-lg xxs:rounded-xl focus:ring-2 focus:ring-green-900 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Menu de navigation mobile - Ultra-responsive pour tous les appareils */}
        <div className={`xl:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 xxs:px-3 sm:px-4 py-2 xxs:py-3 sm:py-4 space-y-1 xxs:space-y-2 max-h-[80vh] overflow-y-auto">
            
            {/* Liens de navigation - Ultra-compacts sur mobile */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-2 xxs:px-3 xs:px-4 py-2 xxs:py-2.5 xs:py-3 text-gray-700 hover:text-white hover:bg-green-900 rounded-md xxs:rounded-lg xs:rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-green-900 text-xs xxs:text-sm xs:text-base"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Menu utilisateur connecté - Compact */}
            {user && (
              <div className="border-t border-gray-200 pt-2 xxs:pt-3 xs:pt-4 mt-2 xxs:mt-3 xs:mt-4">
                <div className="space-y-1 xxs:space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-1.5 xxs:space-x-2 px-2 xxs:px-3 xs:px-4 py-2 xxs:py-2.5 xs:py-3 text-gray-700 hover:text-white hover:bg-green-900 rounded-md xxs:rounded-lg xs:rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-green-900 text-xs xxs:text-sm xs:text-base"
                  >
                    <BarChart3 className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5" />
                    <span>Mon tableau de bord</span>
                  </Link>
                  <Link
                    href="/sell"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-1.5 xxs:space-x-2 px-2 xxs:px-3 xs:px-4 py-2 xxs:py-2.5 xs:py-3 text-gray-700 hover:text-white hover:bg-green-900 rounded-md xxs:rounded-lg xs:rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-green-900 text-xs xxs:text-sm xs:text-base"
                  >
                    <DollarSign className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5" />
                    <span>Vendre un produit</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Actions rapides - Taille ultra-adaptée */}
            <div className="border-t border-gray-200 pt-2 xxs:pt-3 xs:pt-4 mt-2 xxs:mt-3 xs:mt-4">
              <div className="space-y-1 xxs:space-y-2 sm:space-y-3">
                {!user && (
                  <Link
                    href="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full px-2 xxs:px-3 xs:px-4 py-2 xxs:py-2.5 xs:py-3 bg-green-900 text-white rounded-md xxs:rounded-lg xs:rounded-xl hover:bg-green-800 transition-colors font-medium text-xs xxs:text-sm xs:text-base"
                  >
                    <User className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5 mr-1.5 xxs:mr-2" />
                    Se connecter
                  </Link>
                )}
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 xxs:space-x-2 w-full px-2 xxs:px-3 xs:px-4 py-2 xxs:py-2.5 xs:py-3 bg-gray-100 text-gray-700 rounded-md xxs:rounded-lg xs:rounded-xl hover:bg-gray-200 transition-colors font-medium text-xs xxs:text-sm xs:text-base"
                >
                  <Phone className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5" />
                  <span>Nous contacter</span>
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