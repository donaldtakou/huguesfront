'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Smartphone,
  Truck,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { CONTACT_INFO } from '@/lib/demoData';

export default function AuthPage() {
  const router = useRouter();
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
    { value: 'togo', label: 'Togo' }
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
        router.push('/');
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

  const features = [
    {
      icon: Shield,
      title: 'Import sécurisé',
      description: 'Vos commandes sont protégées'
    },
    {
      icon: Smartphone,
      title: 'Électronique premium',
      description: 'Produits USA & Canada authentiques'
    },
    {
      icon: Truck,
      title: 'Livraison rapide',
      description: 'Livraison en 14 jours maximum'
    },
    {
      icon: CheckCircle,
      title: 'Support 7j/7',
      description: 'Assistance client dédiée'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-green-900 hover:text-green-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour à l'accueil</span>
            </Link>
            
            <div className="text-2xl font-bold text-green-900">FastDeal</div>
            
            <a
              href={`tel:${CONTACT_INFO.supplier}`}
              className="text-sm text-gray-600 hover:text-green-900 transition-colors"
            >
              {CONTACT_INFO.supplier}
            </a>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12">
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Rejoignez FastDeal
              </h1>
              <p className="text-xl text-green-100 leading-relaxed">
                La plateforme #1 pour importer de l'électronique premium depuis les USA et le Canada vers l'Afrique de l'Ouest.
              </p>
            </div>
            
            <div className="space-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-green-100">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">F</div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">I</div>
                </div>
                <div>
                  <div className="font-semibold">1,200+ clients satisfaits</div>
                  <div className="text-sm text-green-200">Dans toute l'Afrique de l'Ouest</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">
            {/* Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
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
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  !isLogin
                    ? 'bg-white text-green-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Bon retour !' : 'Créer votre compte'}
                </h2>
                <p className="text-gray-600">
                  {isLogin 
                    ? 'Connectez-vous pour accéder à votre compte' 
                    : 'Rejoignez des milliers de clients satisfaits'
                  }
                </p>
              </div>

              {/* Champs inscription uniquement */}
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Prénom
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required={!isLogin}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900 transition-colors"
                          placeholder="Amadou"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nom
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required={!isLogin}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900 transition-colors"
                          placeholder="Diallo"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required={!isLogin}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900 transition-colors"
                        placeholder="+221 77 123 45 67"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Pays
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900 transition-colors"
                    >
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900 transition-colors"
                    placeholder="amadou@example.com"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmation mot de passe (inscription uniquement) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900 transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-900 text-white py-3 px-4 rounded-xl hover:bg-green-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
              </button>

              {/* Mot de passe oublié */}
              {isLogin && (
                <div className="text-center">
                  <Link href="/auth/forgot-password" className="text-green-900 hover:text-green-700 text-sm font-medium">
                    Mot de passe oublié ?
                  </Link>
                </div>
              )}
            </form>

            {/* Contact Support */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm mb-4">Besoin d'aide ?</p>
              <div className="flex justify-center space-x-4">
                <a
                  href={`tel:${CONTACT_INFO.supplier}`}
                  className="flex items-center space-x-2 text-green-900 hover:text-green-700 font-medium text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-green-900 hover:text-green-700 font-medium text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}