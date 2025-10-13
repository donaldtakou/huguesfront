'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface SimpleProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function SimpleAdminPage() {
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  // Charger les produits depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('simple_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      // Produits par défaut pour démonstration
      const defaultProducts = [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          price: 850000,
          description: 'Smartphone Apple dernière génération',
          image: 'https://via.placeholder.com/300x200/f3f4f6/6b7280?text=iPhone+15+Pro'
        },
        {
          id: '2',
          name: 'MacBook Pro M3',
          price: 2200000,
          description: 'Ordinateur portable Apple avec puce M3',
          image: 'https://via.placeholder.com/300x200/f3f4f6/6b7280?text=MacBook+Pro'
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('simple_products', JSON.stringify(defaultProducts));
    }
  }, []);

  // Sauvegarder automatiquement à chaque changement
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('simple_products', JSON.stringify(products));
    }
  }, [products]);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Nom et prix requis');
      return;
    }

    const product: SimpleProduct = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      description: newProduct.description,
      image: newProduct.image || `https://via.placeholder.com/300x200/f3f4f6/6b7280?text=${encodeURIComponent(newProduct.name)}`
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({ name: '', price: '', description: '', image: '' });
    setShowAddForm(false);
    toast.success('Produit ajouté !');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Produit supprimé !');
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return '';

    // Simuler upload avec base64 pour test local
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Administration FastDeal</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              + Ajouter un produit
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Produits</h2>
              <p className="text-gray-600">{products.length} produits au total</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {products.reduce((sum, p) => sum + p.price, 0).toLocaleString()} FCFA
              </p>
              <p className="text-gray-600">Valeur totale</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Image */}
              <div className="h-48 bg-gray-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x200/f3f4f6/6b7280?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-white text-red-600 w-8 h-8 rounded-full shadow-md hover:bg-red-50 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  <button className="text-gray-500 hover:text-gray-700 text-sm">
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Ajouter un produit</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Ex: iPhone 15 Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Ex: 850000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  rows={3}
                  placeholder="Description du produit..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = await handleFileUpload(file);
                      setNewProduct(prev => ({ ...prev, image: imageUrl }));
                      toast.success('Image ajoutée !');
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">Ou laissez vide pour une image par défaut</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}