'use client';

import { User, ShoppingCart, AlertCircle } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  title?: string;
  message?: string;
  context?: 'cart' | 'product' | 'general';
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  title = "Connexion requise",
  message,
  context = 'general'
}: AuthRequiredModalProps) {
  if (!isOpen) return null;

  const getContextMessage = () => {
    switch (context) {
      case 'cart':
        return "Pour finaliser votre commande, vous devez être connecté à votre compte FastDeal.";
      case 'product':
        return "Pour ajouter ce produit à votre panier, vous devez être connecté à votre compte FastDeal.";
      default:
        return "Vous devez être connecté à votre compte FastDeal pour effectuer cette action.";
    }
  };

  const getContextBenefits = () => {
    switch (context) {
      case 'cart':
        return [
          "Suivi de votre commande",
          "Historique des achats", 
          "Support client personnalisé"
        ];
      case 'product':
        return [
          "Sauvegarde de votre panier",
          "Suivi de vos commandes",
          "Historique des achats"
        ];
      default:
        return [
          "Accès à toutes les fonctionnalités",
          "Suivi personnalisé",
          "Support prioritaire"
        ];
    }
  };

  const getIcon = () => {
    switch (context) {
      case 'cart':
      case 'product':
        return <ShoppingCart className="w-8 h-8 text-white" />;
      default:
        return <User className="w-8 h-8 text-white" />;
    }
  };

  const getCloseButtonText = () => {
    switch (context) {
      case 'cart':
        return "Continuer les achats";
      case 'product':
        return "Continuer sans acheter";
      default:
        return "Fermer";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-900 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {message || getContextMessage()}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-green-900 to-green-800 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-800 hover:to-green-700 transition-all"
            >
              Se connecter
            </button>
            
            <button
              onClick={onRegister}
              className="w-full border-2 border-green-900 text-green-900 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all"
            >
              Créer un compte
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-600 px-6 py-2 hover:text-gray-800 transition-colors"
            >
              {getCloseButtonText()}
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <div className="font-medium">
                  {context === 'cart' ? 'Pourquoi se connecter ?' : 'Avantages de créer un compte :'}
                </div>
                {getContextBenefits().map((benefit, index) => (
                  <div key={index}>• {benefit}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}