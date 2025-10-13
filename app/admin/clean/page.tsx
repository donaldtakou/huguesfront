'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface SimpleProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  brand: string;
}

export default function CleanAdminPage() {
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    brand: '',
    image: ''
  });

  // Charger les produits
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const saved = localStorage.getItem('clean_admin_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      // Produits par défaut avec vraies images
      const defaultProducts = [
        {
          id: '1',
          name: 'iPhone 15 Pro Max',
          price: 850000,
          description: 'Smartphone Apple dernière génération avec puce A17 Pro',
          brand: 'Apple',
          image: 'http://localhost:5000/uploads/products/product-1759417440076-204993095.jpg'
        },
        {
          id: '2',
          name: 'MacBook Pro M3',
          price: 2200000,
          description: 'Ordinateur portable Apple avec puce M3 et écran Retina',
          brand: 'Apple',
          image: 'http://localhost:5000/uploads/products/product-1759417440133-649520703.png'
        }
      ];
      setProducts(defaultProducts);
      saveProducts(defaultProducts);
    }
  };

  const saveProducts = (productsToSave: SimpleProduct[]) => {
    localStorage.setItem('clean_admin_products', JSON.stringify(productsToSave));
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Nom et prix requis');
      return;
    }

    const product: SimpleProduct = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      description: newProduct.description,
      brand: newProduct.brand,
      image: newProduct.image || `https://via.placeholder.com/400x300/f8f9fa/6c757d?text=${encodeURIComponent(newProduct.name)}`
    };

    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    
    setNewProduct({ name: '', price: '', description: '', brand: '', image: '' });
    setShowAddForm(false);
    toast.success('✅ Produit ajouté !');
    console.log('✅ Produit ajouté:', product.name);
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    toast.success('🗑️ Produit supprimé !');
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!file) return '';
    console.log('📤 Upload image:', file.name);

    // D'abord essayer l'upload vers le serveur
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/upload/single', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.image) {
          console.log('✅ Upload serveur réussi:', result.image.url);
          toast.success('🖼️ Image uploadée sur le serveur !');
          return result.image.url;
        }
      }
      
      throw new Error('Upload serveur échoué');
    } catch (error) {
      console.log('⚠️ Serveur non disponible, conversion base64...');
      
      // Fallback vers base64
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log('✅ Conversion base64 terminée');
          toast.success('🖼️ Image convertie !');
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Administration FastDeal</h1>
              <p className="text-sm text-gray-500">{products.length} produits</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
            >
              + Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        
        {/* Message si pas de produits */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter votre premier produit</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
            >
              Ajouter un produit
            </button>
          </div>
        )}

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border hover:shadow-md transition-all">
              {/* Image */}
              <div className="h-48 bg-gray-100 relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log('✅ Image affichée:', product.name)}
                  onError={(e) => {
                    console.log('❌ Erreur image:', product.image);
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300/f8f9fa/6c757d?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                
                {/* Bouton supprimer */}
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="absolute top-2 right-2 bg-white text-red-500 w-8 h-8 rounded-full shadow-md hover:bg-red-50 flex items-center justify-center text-sm font-bold"
                  title="Supprimer"
                >
                  ×
                </button>
              </div>

              {/* Informations */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-lg">{product.name}</h3>
                </div>
                
                {product.brand && (
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                )}
                
                {product.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  <span className="text-xs text-gray-400">
                    ID: {product.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'ajout */}
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
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="Ex: iPhone 15 Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                <input
                  type="text"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="Ex: Apple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="Ex: 850000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
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
                      console.log('📁 Fichier sélectionné:', file.name);
                      const imageUrl = await handleImageUpload(file);
                      setNewProduct(prev => ({ ...prev, image: imageUrl }));
                    }
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                />
                {newProduct.image && (
                  <div className="mt-2">
                    <img src={newProduct.image} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewProduct({ name: '', price: '', description: '', brand: '', image: '' });
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
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