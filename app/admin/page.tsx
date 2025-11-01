'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Package, 
  Plus, 
  Eye, 
  Trash2, 
  Upload,
  LogOut,
  ShoppingBag,
  ImageIcon,
  RefreshCw,
  EyeOff,
  Shield,
  Lock,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  model?: string;
  condition?: string;
  availability?: string;
  images: { url: string; alt?: string }[];
  stock?: number;
  createdAt?: string;
  seller?: any;
}

interface NewProductForm {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  brand: string;
  model: string;
  condition: string;
  stock: string;
  availability: string;
  images: { url: string; alt?: string }[];
}

export default function AdminPage() {
  // États principaux
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editProduct, setEditProduct] = useState<NewProductForm>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'smartphone',
    brand: '',
    model: '',
    condition: 'excellent',
    stock: '1',
    availability: 'in-stock',
    images: []
  });
  
  // États pour nouveau produit
  const [newProduct, setNewProduct] = useState<NewProductForm>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'smartphone',
    brand: '',
    model: '',
    condition: 'excellent',
    stock: '1',
    availability: 'in-stock',
    images: []
  });

  // Charger l'état au démarrage
  useEffect(() => {
    const authSaved = localStorage.getItem('fastdeal_admin_logged');
    if (authSaved === 'true') {
      setIsAuthenticated(true);
      loadProducts();
    }
  }, []);

  // Nettoyer la session à la fermeture de la page/onglet
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Supprimer la session admin lors de la fermeture
      localStorage.removeItem('fastdeal_admin_logged');
      localStorage.removeItem('fastdeal_admin_session');
    };

    // Écouter l'événement de fermeture de la page
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Nettoyer aussi lors du démontage (navigation ailleurs)
      localStorage.removeItem('fastdeal_admin_logged');
      localStorage.removeItem('fastdeal_admin_session');
    };
  }, []);

  // Charger les produits depuis le backend
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      console.log('📥 Chargement des produits depuis le backend...');
      
      const response = await axios.get(`${API_URL}/products`);
      
      if (response.data && response.data.products) {
        setProducts(response.data.products);
        console.log(`✅ ${response.data.products.length} produits chargés depuis le backend`);
        toast.success(`${response.data.products.length} produits chargés`);
      }
    } catch (error: any) {
      console.error('❌ Erreur chargement produits:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('❌ Serveur backend non accessible. Démarrez le serveur backend.');
      } else {
        toast.error('Erreur lors du chargement des produits');
      }
      
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Authentification avec sécurité renforcée
  const handleLogin = () => {
    if (isLocked) {
      toast.error('🔒 Trop de tentatives. Veuillez patienter 30 secondes.');
      return;
    }

    if (adminPassword === 'Admin123!') {
      setIsAuthenticated(true);
      setLoginAttempts(0);
      localStorage.setItem('fastdeal_admin_logged', 'true');
      localStorage.setItem('fastdeal_admin_session', Date.now().toString());
      toast.success('🎉 Connexion réussie !', { duration: 2000 });
      loadProducts();
      setAdminPassword('');
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        toast.error('🔒 Compte temporairement verrouillé (30s)');
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
        }, 30000);
      } else {
        toast.error(`❌ Mot de passe incorrect (${3 - newAttempts} tentatives restantes)`);
      }
      setAdminPassword('');
    }
  };

  // Déconnexion
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('fastdeal_admin_logged');
    toast.success('👋 Déconnecté avec succès');
  };

  // Upload d'image vers le backend
  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Vérifier la taille
      if (file.size > 10 * 1024 * 1024) {
        toast.error('❌ Image trop lourde (max 10MB)');
        return null;
      }

      // Vérifier le type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];
      if (!validTypes.includes(file.type)) {
        toast.error(`❌ Format non supporté: ${file.type}`);
        return null;
      }

      console.log('📤 Upload image:', file.name, file.type, `${(file.size / 1024).toFixed(2)} KB`);

      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${API_URL}/upload/single`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000
      });

      if (response.data.success && response.data.image) {
        const imageUrl = response.data.image.url;
        console.log('✅ Image uploadée:', imageUrl);
        toast.success('✅ Image chargée avec succès!');
        return imageUrl;
      }

      toast.error('❌ Erreur lors de l\'upload');
      return null;

    } catch (error: any) {
      console.error('❌ Erreur upload:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('❌ Serveur backend non accessible');
      } else if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else {
        toast.error('❌ Erreur lors de l\'upload de l\'image');
      }
      
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Ajouter un produit au backend
  const handleAddProduct = async () => {
    try {
      if (!newProduct.name.trim() || !newProduct.price.trim()) {
        toast.error('⚠️ Nom et prix requis !');
        return;
      }

      const price = parseFloat(newProduct.price);
      if (isNaN(price) || price <= 0) {
        toast.error('⚠️ Prix invalide !');
        return;
      }

      setIsLoading(true);

      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: price,
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
        category: newProduct.category,
        brand: newProduct.brand.trim(),
        model: newProduct.model.trim() || undefined,
        condition: newProduct.condition,
        stock: parseInt(newProduct.stock) || 1,
        availability: newProduct.availability,
        images: newProduct.images,
        specifications: {},
        location: {
          city: 'Douala',
          country: 'Cameroun'
        },
        tags: [newProduct.category, newProduct.brand, newProduct.model].filter(Boolean)
      };

      console.log('📤 Création produit:', productData);

      const response = await axios.post(`${API_URL}/products/dev-create`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.product) {
        console.log('✅ Produit créé:', response.data.product);
        toast.success(`🎉 "${response.data.product.name}" ajouté avec succès!`);
        
        // Recharger les produits
        await loadProducts();
        
        // Reset du formulaire
        setNewProduct({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          category: 'smartphone',
          brand: '',
          model: '',
          condition: 'excellent',
          stock: '1',
          availability: 'in-stock',
          images: []
        });
        
        setShowAddModal(false);
      }

    } catch (error: any) {
      console.error('❌ Erreur création produit:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('❌ Serveur backend non accessible');
      } else if (error.response?.status === 401) {
        toast.error('❌ Non autorisé. Authentification requise.');
      } else if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else {
        toast.error('❌ Erreur lors de la création du produit');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Ouvrir le modal d'édition
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      brand: product.brand,
      model: product.model || '',
      condition: product.condition || 'excellent',
      stock: product.stock?.toString() || '1',
      availability: product.availability || 'in-stock',
      images: product.images || []
    });
    setShowEditModal(true);
  };

  // Mettre à jour un produit
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      if (!editProduct.name.trim() || !editProduct.price.trim()) {
        toast.error('⚠️ Nom et prix requis !');
        return;
      }

      const price = parseFloat(editProduct.price);
      if (isNaN(price) || price <= 0) {
        toast.error('⚠️ Prix invalide !');
        return;
      }

      setIsLoading(true);

      const productData = {
        name: editProduct.name.trim(),
        description: editProduct.description.trim(),
        price: price,
        originalPrice: editProduct.originalPrice ? parseFloat(editProduct.originalPrice) : undefined,
        category: editProduct.category,
        brand: editProduct.brand.trim(),
        model: editProduct.model.trim() || undefined,
        condition: editProduct.condition,
        stock: parseInt(editProduct.stock) || 1,
        availability: editProduct.availability,
        images: editProduct.images,
        specifications: {},
        location: {
          city: 'Douala',
          country: 'Cameroun'
        },
        tags: [editProduct.category, editProduct.brand, editProduct.model].filter(Boolean)
      };

      console.log('📤 Mise à jour produit:', productData);

      const response = await axios.put(`${API_URL}/products/dev-update/${selectedProduct._id}`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.product) {
        console.log('✅ Produit mis à jour:', response.data.product);
        toast.success(`🎉 "${response.data.product.name}" modifié avec succès!`);
        
        // Recharger les produits
        await loadProducts();
        
        setShowEditModal(false);
        setSelectedProduct(null);
      }

    } catch (error: any) {
      console.error('❌ Erreur modification produit:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('❌ Serveur backend non accessible');
      } else if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else {
        toast.error('❌ Erreur lors de la modification du produit');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = async (productId: string) => {
    try {
      const productToDelete = products.find(p => p._id === productId);
      
      if (!confirm(`Êtes-vous sûr de vouloir supprimer "${productToDelete?.name}" ?\n\nCette action est irréversible.`)) {
        return;
      }

      setIsLoading(true);
      console.log('🗑️ Suppression produit:', productId);

      // Utiliser la route dev-delete qui ne nécessite pas d'authentification
      await axios.delete(`${API_URL}/products/dev-delete/${productId}`);
      
      console.log('✅ Produit supprimé');
      toast.success(`🗑️ "${productToDelete?.name}" supprimé avec succès!`);
      
      // Recharger les produits
      await loadProducts();

    } catch (error: any) {
      console.error('❌ Erreur suppression:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('❌ Serveur backend non accessible');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('❌ Non autorisé - Utilisez le mode admin');
      } else if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else {
        toast.error('❌ Erreur lors de la suppression');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Page de login moderne et sécurisée
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl relative z-10">
          {/* Header avec icône de sécurité */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl relative">
              <Shield className="w-10 h-10 text-white absolute" />
              <div className="absolute inset-0 bg-green-400/20 rounded-2xl animate-pulse"></div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">FastDeal Admin</h1>
            <p className="text-white/70 text-sm">Panneau d'administration sécurisé</p>
            
            {/* Indicateur de sécurité */}
            <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
              <Lock className="w-3 h-3 text-green-300" />
              <span className="text-xs text-green-200">Connexion sécurisée SSL</span>
            </div>
          </div>
          
          {/* Alerte si compte verrouillé */}
          {isLocked && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-300 flex-shrink-0" />
              <p className="text-sm text-red-200">
                Compte verrouillé temporairement (30s)
              </p>
            </div>
          )}
          
          {/* Indicateur de tentatives */}
          {loginAttempts > 0 && !isLocked && (
            <div className="mb-6 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <p className="text-sm text-yellow-200">
                {3 - loginAttempts} tentative{3 - loginAttempts > 1 ? 's' : ''} restante{3 - loginAttempts > 1 ? 's' : ''}
              </p>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Champ mot de passe avec show/hide */}
            <div className="relative">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLocked && handleLogin()}
                  disabled={isLocked}
                  className="w-full px-4 py-4 pr-12 bg-white/10 backdrop-blur border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              disabled={isLocked || !adminPassword}
              className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-xl hover:from-green-700 hover:to-green-900 transition-all font-semibold shadow-lg hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              <Lock className="w-5 h-5" />
              <span>{isLocked ? 'Compte verrouillé' : 'Se connecter'}</span>
            </button>
          </div>
          
          {/* Informations de sécurité */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="space-y-2 text-xs text-white/50 text-center">
              <p>✓ Connexion sécurisée avec limite de tentatives</p>
              <p>✓ Session expire automatiquement à la fermeture</p>
              <p>✓ Protection contre les attaques par force brute</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Page principale admin
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Administration FastDeal
            </h1>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={loadProducts}
                disabled={isLoading}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                title="Actualiser"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
              
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {products.length} produit{products.length !== 1 ? 's' : ''}
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-700 to-green-900 text-white px-4 py-2 rounded-lg hover:from-green-800 hover:to-green-950 transition-colors flex items-center space-x-2 disabled:opacity-50 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un produit</span>
          </button>
        </div>

        {/* Liste des produits */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun produit pour le moment</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-green-700 hover:text-green-900 font-medium"
            >
              Ajouter le premier produit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Image plus petite */}
                <div className="h-32 bg-gray-100 rounded-t-lg overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzllYTNhOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Infos compactes */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">{product.description}</p>
                  <p className="text-sm font-bold text-green-700 mb-2">{product.price.toLocaleString()} FCFA</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="truncate">{product.brand || 'N/A'}</span>
                    <span>×{product.stock || 0}</span>
                  </div>

                  {/* Actions compactes */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowViewModal(true);
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center"
                      title="Voir les détails"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleEditClick(product)}
                      disabled={isLoading}
                      className="flex-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors flex items-center justify-center disabled:opacity-50"
                      title="Modifier"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={isLoading}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors flex items-center justify-center disabled:opacity-50"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Ajouter Produit */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Ajouter un produit</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                <input
                  type="text"
                  placeholder="Ex: iPhone 15 Pro"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Description du produit"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix actuel (FCFA) *</label>
                  <input
                    type="number"
                    placeholder="500000"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix original (FCFA)</label>
                  <input
                    type="number"
                    placeholder="600000"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
                  <input
                    type="text"
                    placeholder="Ex: Apple, Samsung..."
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <input
                    type="text"
                    placeholder="Ex: iPhone 15 Pro"
                    value={newProduct.model}
                    onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="smartphone">Smartphone</option>
                  <option value="laptop">Laptop</option>
                  <option value="tablet">Tablette</option>
                  <option value="smartwatch">Montre connectée</option>
                  <option value="accessories">Accessoires</option>
                  <option value="electronics">Électronique</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">État *</label>
                  <select
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Très bon</option>
                    <option value="good">Bon</option>
                    <option value="fair">Correct</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    placeholder="1"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité *</label>
                <select
                  value={newProduct.availability}
                  onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="in-stock">En stock</option>
                  <option value="out-of-stock">Rupture de stock</option>
                  <option value="pre-order">Précommande</option>
                  <option value="discontinued">Arrêté</option>
                </select>
              </div>

              {/* Upload d'image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image du produit
                  <span className="text-gray-500 text-xs ml-2">(JPG, PNG, WebP, SVG, GIF - Max 10MB)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = await handleImageUpload(file);
                      if (imageUrl) {
                        setNewProduct({
                          ...newProduct,
                          images: [{ url: imageUrl, alt: newProduct.name }]
                        });
                      }
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                />
                
                {isUploading && (
                  <div className="mt-2 text-sm text-green-700 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
                    Upload en cours...
                  </div>
                )}
                
                {/* Preview de l'image */}
                {newProduct.images.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-1">Aperçu:</p>
                    <div className="relative inline-block">
                      <img
                        src={newProduct.images[0].url}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-green-500"
                      />
                      <button
                        onClick={() => setNewProduct({ ...newProduct, images: [] })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        title="Supprimer l'image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    originalPrice: '',
                    category: 'smartphone',
                    brand: '',
                    model: '',
                    condition: 'excellent',
                    stock: '1',
                    availability: 'in-stock',
                    images: []
                  });
                }}
                disabled={isLoading || isUploading}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.price || isLoading || isUploading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg hover:from-green-800 hover:to-green-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier Produit */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Modifier le produit</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                <input
                  type="text"
                  placeholder="Ex: iPhone 15 Pro"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Description du produit"
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix actuel (FCFA) *</label>
                  <input
                    type="number"
                    placeholder="500000"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix original (FCFA)</label>
                  <input
                    type="number"
                    placeholder="600000"
                    value={editProduct.originalPrice}
                    onChange={(e) => setEditProduct({ ...editProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
                  <input
                    type="text"
                    placeholder="Ex: Apple, Samsung..."
                    value={editProduct.brand}
                    onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <input
                    type="text"
                    placeholder="Ex: iPhone 15 Pro"
                    value={editProduct.model}
                    onChange={(e) => setEditProduct({ ...editProduct, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="smartphone">Smartphone</option>
                  <option value="laptop">Laptop</option>
                  <option value="tablet">Tablette</option>
                  <option value="smartwatch">Montre connectée</option>
                  <option value="accessories">Accessoires</option>
                  <option value="electronics">Électronique</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">État *</label>
                  <select
                    value={editProduct.condition}
                    onChange={(e) => setEditProduct({ ...editProduct, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Très bon</option>
                    <option value="good">Bon</option>
                    <option value="fair">Correct</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    placeholder="1"
                    min="0"
                    value={editProduct.stock}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité *</label>
                <select
                  value={editProduct.availability}
                  onChange={(e) => setEditProduct({ ...editProduct, availability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="in-stock">En stock</option>
                  <option value="out-of-stock">Rupture de stock</option>
                  <option value="pre-order">Précommande</option>
                  <option value="discontinued">Arrêté</option>
                </select>
              </div>

              {/* Upload d'image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image du produit
                  <span className="text-gray-500 text-xs ml-2">(JPG, PNG, WebP, SVG, GIF - Max 10MB)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = await handleImageUpload(file);
                      if (imageUrl) {
                        setEditProduct({
                          ...editProduct,
                          images: [{ url: imageUrl, alt: editProduct.name }]
                        });
                      }
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                
                {isUploading && (
                  <div className="mt-2 text-sm text-blue-700 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                    Upload en cours...
                  </div>
                )}
                
                {/* Preview de l'image */}
                {editProduct.images.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-1">Aperçu:</p>
                    <div className="relative inline-block">
                      <img
                        src={editProduct.images[0].url}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-blue-500"
                      />
                      <button
                        onClick={() => setEditProduct({ ...editProduct, images: [] })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        title="Supprimer l'image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                }}
                disabled={isLoading || isUploading}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateProduct}
                disabled={!editProduct.name || !editProduct.price || isLoading || isUploading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? 'Modification...' : 'Modifier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Voir Produit */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Détails du produit</h3>
            
            {/* Image */}
            {selectedProduct.images && selectedProduct.images.length > 0 && (
              <div className="mb-4">
                <img
                  src={selectedProduct.images[0].url}
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">{selectedProduct.name}</h4>
                {selectedProduct.description && (
                  <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                )}
              </div>
              
              {/* Prix */}
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-green-700">
                    {selectedProduct.price.toLocaleString()} FCFA
                  </span>
                  {(selectedProduct as any).originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {(selectedProduct as any).originalPrice.toLocaleString()} FCFA
                    </span>
                  )}
                </div>
              </div>
              
              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium text-gray-700">Marque:</span>
                  <p className="text-gray-900">{selectedProduct.brand || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium text-gray-700">Catégorie:</span>
                  <p className="text-gray-900 capitalize">{selectedProduct.category}</p>
                </div>
                {(selectedProduct as any).model && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-700">Modèle:</span>
                    <p className="text-gray-900">{(selectedProduct as any).model}</p>
                  </div>
                )}
                {(selectedProduct as any).condition && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-700">État:</span>
                    <p className="text-gray-900 capitalize">{(selectedProduct as any).condition}</p>
                  </div>
                )}
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium text-gray-700">Stock:</span>
                  <p className="text-gray-900">{selectedProduct.stock || 0} unité(s)</p>
                </div>
                {(selectedProduct as any).availability && (
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-700">Disponibilité:</span>
                    <p className="text-gray-900 capitalize">
                      {(selectedProduct as any).availability === 'in-stock' ? 'En stock' : 
                       (selectedProduct as any).availability === 'out-of-stock' ? 'Rupture' :
                       (selectedProduct as any).availability === 'pre-order' ? 'Précommande' : 'Arrêté'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Vendeur */}
              {selectedProduct.seller && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Vendeur:</span>{' '}
                    {selectedProduct.seller.firstName} {selectedProduct.seller.lastName}
                  </p>
                </div>
              )}

              {/* Date de création */}
              {selectedProduct.createdAt && (
                <div className="text-xs text-gray-500">
                  Ajouté le {new Date(selectedProduct.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}