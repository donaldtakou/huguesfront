'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Connexion réussie !');
      
      // Redirection vers la page d'origine ou accueil
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Bon retour !
          </h1>
          <p className="text-green-700">
            Connectez-vous à votre compte FastDeal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  disabled={loading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Votre mot de passe"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  disabled={loading}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              ) : (
                <>
                  <LogIn className="w-5 h-5 inline mr-2" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link 
              href="/auth/forgot-password" 
              className="block text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Mot de passe oublié ?
            </Link>
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link 
                href="/auth/register" 
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-green-600 hover:text-green-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à l'accueil
          </Link>
          <p className="text-xs text-green-500 mt-2">
            FastDeal © 2025 - Marketplace sécurisée en Afrique de l'Ouest
          </p>
        </div>
      </div>
    </div>
  );
}