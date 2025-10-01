'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3,
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Plus,
  Settings,
  Bell,
  Eye,
  Check,
  X,
  Monitor,
  Edit3,
  Save,
  RefreshCw,
  Globe,
  Truck,
  Phone,
  Mail,
  MessageCircle,
  Building,
  Smartphone,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertTriangle,
  Edit
} from 'lucide-react';
// import { CONTACT_INFO } from '@/lib/demoData';
import adminEndpoints from '@/lib/adminAPI';
import { toast } from 'react-hot-toast';
import { Product } from '@/types';

// Temporary inline CONTACT_INFO to avoid import issues
const CONTACT_INFO = {
  supplier: '+1(206)786-9764',
  email: 'contact@fastdeal-africa.com',
  whatsapp: '+1(206)786-9764',
  address: 'Import direct USA/Canada vers Afrique de l\'Ouest'
};

interface ImageUpload {
  url: string;
  file?: File;
  isPrimary: boolean;
}

interface NewProduct {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  condition: string;
  stock: string;
  specifications: Record<string, any>;
  tags: string[];
  images: ImageUpload[];
}

export default function AdminPage() {
  // Mode développement - accès direct sans authentification
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Accès direct
  const [userRole, setUserRole] = useState('admin'); // Role admin direct
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  // Modales
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Produits
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Pagination et filtres
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Formulaire nouveau produit
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    condition: 'new',
    stock: '',
    specifications: {},
    tags: [],
    images: []
  });
  
  // Données modifiables
  const [editableData, setEditableData] = useState({
    companyName: 'FastDeal Import',
    description: 'Plateforme leader d\'import d\'électronique premium depuis les USA et le Canada vers l\'Afrique de l\'Ouest',
    phone: CONTACT_INFO.supplier,
    email: CONTACT_INFO.email,
    whatsapp: CONTACT_INFO.whatsapp,
    deliveryTime: '14',
    customsFees: '15'
  });

  // Check server health
  const checkServerHealth = async () => {
    try {
      setServerStatus('checking');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setServerStatus('online');
        console.log('✅ Serveur backend en ligne');
      } else {
        setServerStatus('offline');
        console.log('⚠️ Serveur backend répond mais avec erreur');
      }
    } catch (error) {
      setServerStatus('offline');
      console.log('❌ Serveur backend hors ligne:', error);
      toast.error('Serveur non disponible. Mode démonstration activé.');
    }
  };

  // Charger les produits depuis l'API
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter })
      };
      
      const response = await adminEndpoints.getProducts();
      setProducts(response.data.products || response.data);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error: any) {
      console.error('Erreur lors du chargement des produits:', error);
      
      // Handle different types of errors
      if (error.message?.includes('timeout') || error.code === 'ECONNABORTED') {
        toast.error('Connexion au serveur expirée. Utilisation des données de démonstration.');
      } else if (!error.response) {
        toast.error('Serveur non disponible. Utilisation des données de démonstration.');
      } else {
        toast.error('Erreur lors du chargement des produits');
      }
      
      // Use fallback demo data when API is not available
      const fallbackProducts = [
        {
          _id: 'demo-1',
          name: 'iPhone 15 Pro Max 512GB',
          description: 'iPhone 15 Pro Max avec 512GB de stockage. Importé directement des USA. Garantie internationale.',
          price: 850000,
          category: 'smartphone' as const,
          brand: 'Apple',
          model: '15 Pro Max',
          condition: 'excellent' as const,
          stock: 5,
          availability: 'in-stock' as const,
          specifications: {
            storage: '512GB',
            color: 'Titanium Natural',
            screenSize: '6.7 pouces',
            processor: 'A17 Pro'
          },
          tags: ['premium', 'latest', 'usa-import'],
          images: [{ url: '/placeholder-product.jpg', alt: 'iPhone 15 Pro Max', isPrimary: true }],
          seller: {
            _id: 'admin',
            firstName: 'FastDeal',
            lastName: 'Import',
            statistics: { averageRating: 5.0, totalReviews: 100 },
            createdAt: new Date().toISOString()
          },
          views: 0,
          isValidated: true,
          isFeatured: true,
          location: { city: 'Dakar', region: 'Dakar', country: 'Sénégal' },
          discountPercentage: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'demo-2',
          name: 'MacBook Air M3 15"',
          description: 'MacBook Air avec puce M3, écran 15 pouces. Parfait pour les professionnels.',
          price: 980000,
          category: 'laptop' as const,
          brand: 'Apple',
          model: 'Air M3',
          condition: 'excellent' as const,
          stock: 3,
          availability: 'in-stock' as const,
          specifications: {
            processor: 'Apple M3',
            ram: '16GB',
            storage: '512GB SSD',
            screenSize: '15.3 pouces'
          },
          tags: ['professional', 'portable', 'latest'],
          images: [{ url: '/placeholder-product.jpg', alt: 'MacBook Air M3', isPrimary: true }],
          seller: {
            _id: 'admin',
            firstName: 'FastDeal',
            lastName: 'Import',
            statistics: { averageRating: 5.0, totalReviews: 100 },
            createdAt: new Date().toISOString()
          },
          views: 0,
          isValidated: true,
          isFeatured: true,
          location: { city: 'Dakar', region: 'Dakar', country: 'Sénégal' },
          discountPercentage: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'demo-3',
          name: 'iPad Pro 11" M4',
          description: 'iPad Pro avec puce M4, parfait pour le travail créatif et la productivité.',
          price: 750000,
          category: 'tablet' as const,
          brand: 'Apple',
          model: 'Pro 11"',
          condition: 'excellent' as const,
          stock: 8,
          availability: 'in-stock' as const,
          specifications: {
            processor: 'Apple M4',
            screenSize: '11 pouces',
            storage: '256GB'
          },
          tags: ['creative', 'portable', 'professional'],
          images: [{ url: '/placeholder-product.jpg', alt: 'iPad Pro 11" M4', isPrimary: true }],
          seller: {
            _id: 'admin',
            firstName: 'FastDeal',
            lastName: 'Import',
            statistics: { averageRating: 5.0, totalReviews: 100 },
            createdAt: new Date().toISOString()
          },
          views: 0,
          isValidated: true,
          isFeatured: true,
          location: { city: 'Dakar', region: 'Dakar', country: 'Sénégal' },
          discountPercentage: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setProducts(fallbackProducts);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les produits au montage du composant
  useEffect(() => {
    // Chargement immédiat en mode développement
    checkServerHealth();
    loadProducts();
  }, [currentPage, searchTerm, categoryFilter]);

  // Fonctions de gestion des produits
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      // Préparer les données pour l'API
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        brand: newProduct.brand,
        condition: newProduct.condition,
        stock: parseInt(newProduct.stock) || 0,
        specifications: newProduct.specifications,
        tags: newProduct.tags,
        images: newProduct.images.length > 0 ? 
          newProduct.images.map(img => ({ url: img.url, isPrimary: img.isPrimary })) :
          [{ url: '/placeholder-product.jpg', isPrimary: true }]
      };

      await adminEndpoints.createProduct(productData);
      setShowAddProductModal(false);
      resetNewProduct();
      toast.success('Produit ajouté avec succès !');
      
      // Recharger la liste des produits
      await loadProducts();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    setIsLoading(true);
    try {
      await adminEndpoints.updateProduct(selectedProduct._id, selectedProduct);
      setShowEditProductModal(false);
      setSelectedProduct(null);
      toast.success('Produit modifié avec succès !');
      
      // Recharger la liste des produits
      await loadProducts();
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
      toast.error('Erreur lors de la modification du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setIsLoading(true);
    try {
      await adminEndpoints.deleteProduct(selectedProduct._id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
      toast.success('Produit supprimé avec succès !');
      
      // Recharger la liste des produits
      await loadProducts();
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      toast.error('Erreur lors de la suppression du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewProduct = (product: any) => {
    setSelectedProduct(product);
    setShowPreviewModal(true);
  };

  const handleEditProductClick = (product: any) => {
    setSelectedProduct({ ...product });
    setShowEditProductModal(true);
  };

  const handleDeleteProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      condition: 'new',
      stock: '',
      specifications: {},
      tags: [],
      images: []
    });
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    fileArray.forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const newImage: ImageUpload = {
              url: e.target.result as string,
              file: file,
              isPrimary: newProduct.images.length === 0
            };
            setNewProduct(prev => ({
              ...prev,
              images: [...prev.images, newImage]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Données simulées pour le dashboard
  const dashboardStats = {
    totalProducts: products.length,
    totalOrders: 156,
    totalRevenue: 45750000,
    activeUsers: 1247
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Amadou Diallo',
      country: 'Sénégal',
      product: 'iPhone 15 Pro Max',
      amount: 850000,
      status: 'processing'
    },
    {
      id: 'ORD-002',
      customer: 'Fatou Kone',
      country: 'Côte d\'Ivoire',
      product: 'MacBook Air M3',
      amount: 980000,
      status: 'shipped'
    },
    {
      id: 'ORD-003',
      customer: 'Ibrahim Traore',
      country: 'Mali',
      product: 'iPad Pro 11"',
      amount: 750000,
      status: 'delivered'
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Produits Total',
            value: dashboardStats.totalProducts,
            icon: Package,
            color: 'text-green-900',
            bgColor: 'bg-green-100',
            change: '+12%'
          },
          {
            title: 'Commandes',
            value: dashboardStats.totalOrders,
            icon: ShoppingCart,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100',
            change: '+8%'
          },
          {
            title: 'Revenus (FCFA)',
            value: dashboardStats.totalRevenue.toLocaleString(),
            icon: DollarSign,
            color: 'text-green-900',
            bgColor: 'bg-green-100',
            change: '+23%'
          },
          {
            title: 'Utilisateurs Actifs',
            value: dashboardStats.activeUsers,
            icon: Users,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100',
            change: '+15%'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Commandes Récentes</h2>
          <Link href="/admin/orders" className="text-green-900 hover:text-green-700 font-medium">
            Voir tout
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Commande</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Pays</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Produit</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Montant</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                  <td className="py-3 px-4 text-gray-700">{order.country}</td>
                  <td className="py-3 px-4 text-gray-700">{order.product}</td>
                  <td className="py-3 px-4 text-gray-700">{order.amount.toLocaleString()} FCFA</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'delivered' ? 'Livré' :
                       order.status === 'shipped' ? 'Expédié' :
                       order.status === 'processing' ? 'En cours' : 'Inconnu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
        <button 
          onClick={() => setShowAddProductModal(true)}
          className="bg-green-900 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter Produit</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <img 
                src={product.images[0]?.url} 
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.brand}</p>
              <p className="font-bold text-green-900 mb-4">{product.price.toLocaleString()} FCFA</p>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handlePreviewProduct(product)}
                  className="flex-1 bg-green-100 text-green-900 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                  title="Prévisualiser"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEditProductClick(product)}
                  className="flex-1 bg-orange-100 text-orange-500 py-2 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center"
                  title="Modifier"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProductClick(product)}
                  className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-8">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold shadow">Prévisualisation Site Web</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                editMode ? 'bg-green-500 hover:bg-green-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {editMode ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{editMode ? 'Sauvegarder' : 'Modifier'}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              <Monitor className="w-4 h-4" />
              <span>Aperçu Live</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Globe className="w-5 h-5" />
              <span className="font-semibold">Site Web</span>
            </div>
            <p className="text-sm opacity-90">Version live accessible aux clients</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Smartphone className="w-5 h-5" />
              <span className="font-semibold">Mobile Ready</span>
            </div>
            <p className="text-sm opacity-90">Optimisé pour tous les appareils</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-2">
              <RefreshCw className="w-5 h-5" />
              <span className="font-semibold">Temps réel</span>
            </div>
            <p className="text-sm opacity-90">Modifications instantanées</p>
          </div>
        </div>
      </div>

      {/* Informations de l'entreprise */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Building className="w-6 h-6 mr-3 text-green-600" />
          Informations de l'Entreprise
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nom de l'entreprise
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={editableData.companyName}
                  onChange={(e) => setEditableData({...editableData, companyName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {editableData.companyName}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              {editMode ? (
                <textarea
                  value={editableData.description}
                  onChange={(e) => setEditableData({...editableData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700">
                  {editableData.description}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Téléphone Fournisseur
              </label>
              {editMode ? (
                <input
                  type="tel"
                  value={editableData.phone}
                  onChange={(e) => setEditableData({...editableData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {editableData.phone}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Contact
              </label>
              {editMode ? (
                <input
                  type="email"
                  value={editableData.email}
                  onChange={(e) => setEditableData({...editableData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {editableData.email}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                WhatsApp Business
              </label>
              {editMode ? (
                <input
                  type="tel"
                  value={editableData.whatsapp}
                  onChange={(e) => setEditableData({...editableData, whatsapp: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {editableData.whatsapp}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Paramètres de livraison */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Truck className="w-6 h-6 mr-3 text-green-600" />
          Paramètres de Livraison & Import
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Délai de livraison (jours)
            </label>
            {editMode ? (
              <input
                type="number"
                value={editableData.deliveryTime}
                onChange={(e) => setEditableData({...editableData, deliveryTime: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                {editableData.deliveryTime} jours
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Frais de douane (%)
            </label>
            {editMode ? (
              <input
                type="number"
                value={editableData.customsFees}
                onChange={(e) => setEditableData({...editableData, customsFees: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                {editableData.customsFees}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Paramètres Système</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-green-600" />
            Informations de Contact
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Numéro Fournisseur
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="tel"
                  value={CONTACT_INFO.supplier}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                  readOnly
                />
                <a
                  href={`tel:${CONTACT_INFO.supplier}`}
                  className="bg-green-900 text-white px-4 py-3 rounded-xl hover:bg-green-800 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Contact
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="email"
                  value={CONTACT_INFO.email}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                  readOnly
                />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="bg-green-900 text-white px-4 py-3 rounded-xl hover:bg-green-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                WhatsApp Business
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="tel"
                  value={CONTACT_INFO.whatsapp}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                  readOnly
                />
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-900 text-white px-4 py-3 rounded-xl hover:bg-green-800 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Import Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-orange-600" />
            Paramètres d'Import
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Pays d'Import Principal
              </label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900">
                <option>États-Unis</option>
                <option>Canada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Délai de Livraison (jours)
              </label>
              <input
                type="number"
                defaultValue="14"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Frais de Douane (%)
              </label>
              <input
                type="number"
                defaultValue="15"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-gradient-to-r from-green-900 to-orange-600 rounded-2xl p-8 text-white">
        <h3 className="text-xl font-bold mb-6">Actions Rapides</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-colors text-center">
            <RefreshCw className="w-6 h-6 mb-2 mx-auto" />
            <div className="font-semibold">Actualiser Cache</div>
            <div className="text-sm opacity-90">Mettre à jour les données</div>
          </button>
          
          <Link href="/" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-colors text-center block">
            <Eye className="w-6 h-6 mb-2 mx-auto" />
            <div className="font-semibold">Voir le Site</div>
            <div className="text-sm opacity-90">Version client</div>
          </Link>
          
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-colors text-center">
            <Check className="w-6 h-6 mb-2 mx-auto" />
            <div className="font-semibold">Publier</div>
            <div className="text-sm opacity-90">Mettre en ligne</div>
          </button>
        </div>
      </div>
    </div>
  );

  // Temporary authentication bypass for development
  // TODO: Remove in production and implement proper auth check
  if (!isAuthenticated || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Mode Développement - Accès Admin
            </h1>
            <p className="text-gray-600 mb-6">
              Cliquez sur le bouton ci-dessous pour accéder à l'interface d'administration en mode développement.
            </p>
            <button
              onClick={() => {
                setIsAuthenticated(true);
                setUserRole('admin');
              }}
              className="bg-green-900 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition-colors"
            >
              Accéder en mode développement
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
              <Link href="/" className="text-2xl font-bold text-green-900 hover:text-green-700 transition-colors">
                FastDeal Admin
              </Link>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Afrique de l'Ouest
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Server Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  serverStatus === 'online' ? 'bg-green-500' :
                  serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {serverStatus === 'online' ? 'Serveur en ligne' :
                   serverStatus === 'offline' ? 'Mode démonstration' : 'Vérification...'}
                </span>
              </div>
              
              <button className="p-2 text-gray-600 hover:text-green-900 transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
              </button>
              <Link 
                href="/" 
                className="text-gray-600 hover:text-green-900 transition-colors font-medium"
              >
                Voir le site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-2 bg-white rounded-2xl p-2 shadow-sm">
            {[
              { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
              { id: 'products', label: 'Produits', icon: Package },
              { id: 'preview', label: 'Prévisualisation', icon: Monitor },
              { id: 'settings', label: 'Paramètres', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-900 text-white shadow-lg'
                      : 'text-gray-600 hover:text-green-900 hover:bg-green-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'preview' && renderPreview()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Modal Ajout Produit */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Ajouter un Produit</h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: iPhone 15 Pro Max"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: 850000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="smartphone">Smartphone</option>
                    <option value="laptop">Ordinateur portable</option>
                    <option value="tablet">Tablette</option>
                    <option value="smartwatch">Montre connectée</option>
                    <option value="headphone">Écouteurs</option>
                    <option value="console">Console de jeu</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marque
                  </label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Apple"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État
                  </label>
                  <select
                    value={newProduct.condition}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="new">Neuf</option>
                    <option value="like-new">Comme neuf</option>
                    <option value="good">Bon état</option>
                    <option value="fair">État correct</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: 10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Description détaillée du produit..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Cliquez pour ajouter des images</p>
                  </label>
                  
                  {newProduct.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {newProduct.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image.url} 
                            alt={`Preview ${index}`}
                            className="w-full h-16 object-cover rounded"
                          />
                          <button
                            onClick={() => setNewProduct(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={isLoading}
                  className="bg-green-900 text-white px-6 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{isLoading ? 'Ajout...' : 'Ajouter'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Prévisualisation */}
      {showPreviewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Prévisualisation - {selectedProduct.name}</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img 
                    src={selectedProduct.images[0]?.url} 
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  {selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1, 5).map((image: any, index: number) => (
                        <img 
                          key={index}
                          src={image.url} 
                          alt={`${selectedProduct.name} ${index + 2}`}
                          className="w-full h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h4>
                    <p className="text-lg text-gray-600">{selectedProduct.brand}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-green-900">
                      {selectedProduct.price.toLocaleString()} FCFA
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProduct.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                      selectedProduct.condition === 'very-good' ? 'bg-blue-100 text-blue-800' :
                      selectedProduct.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedProduct.condition === 'excellent' ? 'Excellent' :
                       selectedProduct.condition === 'very-good' ? 'Très bon' :
                       selectedProduct.condition === 'good' ? 'Bon état' : 
                       selectedProduct.condition === 'fair' ? 'État correct' : 'Mauvais état'}
                    </span>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>
                  
                  {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Spécifications</h5>
                      <div className="space-y-1">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Stock disponible:</span>
                      <span className="font-medium">{selectedProduct.stock || 0} unités</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Catégorie:</span>
                      <span className="font-medium capitalize">{selectedProduct.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Supprimer le produit
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Êtes-vous sûr de vouloir supprimer "{selectedProduct.name}" ? 
                Cette action est irréversible.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{isLoading ? 'Suppression...' : 'Supprimer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}