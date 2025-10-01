'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Shield, 
  Gift,
  AlertCircle,
  Check
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentModal from '@/components/PaymentModal';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalPrice,
    getTotalItems 
  } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingCost = totalPrice >= 50 ? 0 : 5.99;
  const discount = appliedPromo ? totalPrice * 0.1 : 0; // 10% discount example
  const finalTotal = totalPrice + shippingCost - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setAppliedPromo('WELCOME10');
      toast.success('Code promo appliqué ! -10%');
    } else {
      toast.error('Code promo invalide');
    }
    setPromoCode('');
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    toast.success('Paiement réussi ! Votre commande est confirmée.');
    clearCart();
    // Redirection vers page de confirmation
    // router.push('/order-confirmation');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez nos produits et commencez vos achats
            </p>
            <div className="space-y-4">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 bg-green-900 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors font-semibold"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Découvrir les produits</span>
              </Link>
              <div className="block">
                <Link
                  href="/"
                  className="text-green-900 hover:text-green-700 font-medium"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-green-900">Accueil</Link>
          <span>/</span>
          <span className="text-gray-900">Panier</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon panier</h1>
            <p className="text-gray-600 mt-2">
              {totalItems} article{totalItems > 1 ? 's' : ''} dans votre panier
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center space-x-2 text-green-900 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continuer les achats</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Articles ({totalItems})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images.length > 0 && (
                          <img
                            src={item.product.images.find(img => img.isPrimary)?.url || item.product.images[0]?.url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              <Link 
                                href={`/products/${item.product._id}`}
                                className="hover:text-green-900 transition-colors"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span>{item.product.brand}</span>
                              <span>•</span>
                              <span>{getCategoryLabel(item.product.category)}</span>
                              <span>•</span>
                              <span className="text-green-600 font-medium">
                                {item.product.condition === 'excellent' ? 'Excellent état' : 
                                 item.product.condition === 'very-good' ? 'Très bon état' :
                                 item.product.condition === 'good' ? 'Bon état' : 'État correct'}
                              </span>
                            </div>
                            
                            {/* Price */}
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-green-900">
                                {formatPrice(item.product.price)}
                              </span>
                              {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                                <>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.product.originalPrice)}
                                  </span>
                                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                    -{item.product.discountPercentage}%
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity and Subtotal */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Quantité :</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatPrice(item.product.price)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Gift className="w-5 h-5 text-orange-500" />
                <span>Code promo</span>
              </h3>
              
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Code {appliedPromo} appliqué
                    </span>
                  </div>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Entrez votre code promo"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                    className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Appliquer
                  </button>
                </div>
              )}
              
              <div className="mt-3 text-sm text-gray-500">
                💡 Essayez le code "WELCOME10" pour 10% de réduction
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Récapitulatif
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total ({totalItems} articles)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction ({appliedPromo})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-900">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {totalPrice >= 50 ? 
                      'Livraison gratuite incluse !' :
                      `Plus que ${formatPrice(50 - totalPrice)} pour la livraison gratuite`
                    }
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full mt-6 bg-green-900 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>
                  {isCheckingOut ? 'Traitement...' : 'Passer la commande'}
                </span>
              </button>

              {/* Security Info */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Vos avantages</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Garantie vendeur</div>
                    <div className="text-sm text-gray-500">30 jours de protection</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Livraison rapide</div>
                    <div className="text-sm text-gray-500">2-3 jours ouvrés</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Retour gratuit</div>
                    <div className="text-sm text-gray-500">14 jours pour changer d'avis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={Math.round(finalTotal * 655.957)} // Convert to FCFA
        onPaymentSuccess={handlePaymentSuccess}
      />

      <Footer />
    </div>
  );
}