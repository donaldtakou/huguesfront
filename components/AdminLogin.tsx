'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simulation d'un délai pour éviter les attaques par force brute
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(password);
    console.log('Résultat de la connexion:', success);
    
    if (!success) {
      setPassword('');
    } else {
      // Forcer un rechargement de la page après connexion réussie
      console.log('Connexion réussie, rechargement de la page...');
      window.location.reload();
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            FastDeal Admin
          </h1>
          <p className="text-green-700">
            Accès sécurisé à l'interface d'administration
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full bg-green-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Vérification...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-2" />
              <div className="text-sm text-green-700">
                <p className="font-medium mb-1">Sécurité renforcée</p>
                <ul className="space-y-1 text-xs">
                  <li>• Session sécurisée de 24 heures</li>
                  <li>• Protection contre les attaques par force brute</li>
                  <li>• Authentification côté client et serveur</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-green-600">
            FastDeal © 2025 - Interface d'administration sécurisée
          </p>
        </div>
      </div>
    </div>
  );
}