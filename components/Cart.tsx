'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Clock, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

const Cart = () => {
  const { 
    items, 
    isOpen, 
    setCartOpen, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalPrice,
    getTotalItems,
    clearExpiredItems,
    updateActivity
  } = useCartStore();

  const [timeLeft, setTimeLeft] = useState<string>('');

  // Mettre à jour l'activité quand le panier est ouvert
  useEffect(() => {
    if (isOpen) {
      updateActivity();
    }
  }, [isOpen, updateActivity]);

  // Auto-nettoyage et calcul du temps restant
  useEffect(() => {
    const interval = setInterval(() => {
      clearExpiredItems();
      
      // Calculer le temps jusqu'à expiration du plus ancien article
      if (items.length > 0) {
        const oldestItem = items.reduce((oldest, current) => {
          return new Date(current.addedAt) < new Date(oldest.addedAt) ? current : oldest;
        });
        
        if (oldestItem.expiresAt) {
          const now = new Date();
          const expiry = new Date(oldestItem.expiresAt);
          const timeDiff = expiry.getTime() - now.getTime();
          
          if (timeDiff > 0) {
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${hours}h ${minutes}m`);
          } else {
            setTimeLeft('Expiré');
          }
        }
      }
    }, 60000); // Mettre à jour chaque minute

    return () => clearInterval(interval);
  }, [items, clearExpiredItems]);

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleClearCart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      clearCart();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setCartOpen(false)}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-green-900" />
              <h2 className="text-xl font-bold text-gray-900">
                Mon panier ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Expiry Warning */}
          {items.length > 0 && timeLeft && (
            <div className="mx-4 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-800">
                  {timeLeft === 'Expiré' ? (
                    <>
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Certains articles ont expiré
                    </>
                  ) : (
                    `Articles supprimés dans ${timeLeft}`
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-gray-500 mb-6">
                  Découvrez nos produits et ajoutez-les à votre panier
                </p>
                <Link
                  href="/products"
                  onClick={() => setCartOpen(false)}
                  className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
                >
                  Découvrir les produits
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{items.length} article(s)</span>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
                
                {items.map((item) => {
                  const isExpired = item.expiresAt && new Date() > new Date(item.expiresAt);
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`flex items-center space-x-4 rounded-lg p-4 ${
                        isExpired ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                      }`}
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images.length > 0 && (
                          <img
                            src={item.product.images.find(img => img.isPrimary)?.url || item.product.images[0]?.url}
                            alt={item.product.name}
                            className={`w-full h-full object-cover ${isExpired ? 'grayscale' : ''}`}
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.product.name}
                          {isExpired && <span className="ml-2 text-xs">(Expiré)</span>}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.product.brand} • {item.product.model}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-green-900">
                            {formatPrice(item.product.price)}
                          </span>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isExpired}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isExpired}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-green-900">{formatPrice(totalPrice)}</span>
              </div>

              {/* Shipping Info */}
              <div className="text-sm text-gray-500 text-center">
                {totalPrice >= 50 ? (
                  <span className="text-green-600 font-medium">
                    ✓ Livraison gratuite incluse
                  </span>
                ) : (
                  <span>
                    Livraison gratuite dès {formatPrice(50)} 
                    (encore {formatPrice(50 - totalPrice)} à ajouter)
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="w-full bg-green-900 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Finaliser ma commande</span>
                </Link>
                
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continuer les achats
                </button>
                
                <button
                  onClick={handleClearCart}
                  className="w-full text-red-600 py-2 text-sm font-medium hover:text-red-700 transition-colors"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;