'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Phone,
  ArrowLeft,
  Shield,
  CheckCircle,
  UserPlus,
  LogIn,
  Globe,
  Smartphone,
  Truck,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

const CONTACT_INFO = {
  supplier: '+221 77 123 45 67',
  whatsapp: '+221 77 123 45 67'
};

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: 'senegal'
  });

  const countries = [
    { value: 'senegal', label: 'Sénégal' },
    { value: 'cote-ivoire', label: 'Côte d\'Ivoire' },
    { value: 'mali', label: 'Mali' },
    { value: 'burkina-faso', label: 'Burkina Faso' },
    { value: 'guinea', label: 'Guinée' },
    { value: 'niger', label: 'Niger' },
    { value: 'benin', label: 'Bénin' },
    { value: 'togo', label: 'Togo' },
    { value: 'ghana', label: 'Ghana' },
    { value: 'other', label: 'Autre' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        await login(formData.email, formData.password);
        toast.success('Connexion réussie !');
        
        // Redirection vers la page d'origine ou accueil
        const redirect = searchParams.get('redirect');
        router.push(redirect || '/');
      } else {
        // Inscription
        if (formData.password !== formData.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas');
          return;
        }
        
        if (formData.password.length < 6) {
          toast.error('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }

        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          country: formData.country
        });
        
        toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsLogin(true);
      }
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
            {isLogin ? (
              <LogIn className="w-8 h-8 text-white" />
            ) : (
              <UserPlus className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            {isLogin ? 'Bon retour !' : 'Rejoignez FastDeal'}
          </h1>
          <p className="text-green-700">
            {isLogin 
              ? 'Connectez-vous à votre compte FastDeal'
              : 'Créez votre compte et découvrez notre marketplace'
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Toggle Login/Register */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                isLogin 
                  ? 'bg-white text-green-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                !isLogin 
                  ? 'bg-white text-green-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champs d'inscription uniquement */}
            {!isLogin && (
              <>
                {/* Nom et Prénom */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Prénom"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        disabled={loading}
                        required={!isLogin}
                        autoComplete="given-name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Nom"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      disabled={loading}
                      required={!isLogin}
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                {/* Pays */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none bg-white"
                      disabled={loading}
                      required={!isLogin}
                    >
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+221 77 123 45 67"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      disabled={loading}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </>
            )}

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

            {/* Mot de passe */}
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
                  autoComplete={isLogin ? "current-password" : "new-password"}
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

            {/* Confirmer mot de passe (inscription uniquement) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre mot de passe"
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    disabled={loading}
                    required={!isLogin}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            )}

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
                  {isLogin ? 'Connexion...' : 'Création du compte...'}
                </span>
              ) : (
                <>
                  {isLogin ? (
                    <LogIn className="w-5 h-5 inline mr-2" />
                  ) : (
                    <UserPlus className="w-5 h-5 inline mr-2" />
                  )}
                  {isLogin ? 'Se connecter' : 'Créer mon compte'}
                </>
              )}
            </button>
          </form>

          {/* Links */}
          {isLogin && (
            <div className="mt-6 text-center">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          )}
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
