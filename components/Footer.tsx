'use client';

import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  Globe,
  ChevronUp,
  MessageCircle,
  Smartphone,
  CheckCircle
} from 'lucide-react';
import Logo from './Logo';
import { CONTACT_INFO } from '@/lib/demoData';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    company: [
      { name: 'À propos de nous', href: '/about' },
      { name: 'Import USA/Canada', href: '/import' },
      { name: 'Notre réseau', href: '/network' },
      { name: 'Partenaires', href: '/partners' },
      { name: 'Témoignages', href: '/testimonials' },
    ],
    services: [
      { name: 'Comment commander', href: '/how-to-order' },
      { name: 'Guide d\'import', href: '/import-guide' },
      { name: 'Devis personnalisé', href: '/quote' },
      { name: 'Suivi de commande', href: '/tracking' },
      { name: 'Garantie produit', href: '/warranty' },
    ],
    support: [
      { name: 'Centre d\'aide', href: '/help' },
      { name: 'Contact', href: '/contact' },
      { name: 'Livraison Afrique', href: '/shipping-africa' },
      { name: 'Douanes & Taxes', href: '/customs' },
      { name: 'Support technique', href: '/technical-support' },
    ],
    legal: [
      { name: 'Conditions d\'utilisation', href: '/terms' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'Politique d\'import', href: '/import-policy' },
      { name: 'Mentions légales', href: '/legal' },
      { name: 'Conformité CEDEAO', href: '/cedeao' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/fastdeal' },
    { name: 'Twitter', icon: Twitter, href: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/fastdeal' },
    { name: 'Instagram', icon: Instagram, href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/fastdeal' },
    { name: 'LinkedIn', icon: Linkedin, href: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/fastdeal' },
    { name: 'YouTube', icon: Youtube, href: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/fastdeal' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Import sécurisé',
      description: 'Produits authentiques garantis'
    },
    {
      icon: Truck,
      title: 'Livraison Afrique',
      description: 'Livraison dans toute l\'Afrique de l\'Ouest'
    },
    {
      icon: Globe,
      title: 'USA & Canada',
      description: 'Import direct depuis l\'Amérique du Nord'
    },
    {
      icon: Smartphone,
      title: 'Paiement mobile',
      description: 'Orange Money, MTN Money, PayPal'
    },
  ];

  const paymentMethods = [
    { name: 'Orange Money', icon: 'OM' },
    { name: 'MTN Money', icon: 'MTN' },
    { name: 'PayPal', icon: 'PP' },
    { name: 'Visa', icon: 'VI' },
    { name: 'Mastercard', icon: 'MC' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 border-b border-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-green-100">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Restez informé des nouveaux arrivages
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Recevez notre newsletter et ne manquez aucun arrivage d'électronique premium USA/Canada
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Logo variant="white" size="lg" />
            <p className="mt-4 text-gray-300 text-sm leading-relaxed">
              FastDeal est la plateforme leader pour l'import d'électronique premium depuis les USA et le Canada 
              vers l'Afrique de l'Ouest. Smartphones, tablettes, ordinateurs et montres connectées authentiques 
              à prix compétitifs avec livraison sécurisée.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-orange-500" />
                <a href={`tel:${CONTACT_INFO.supplier}`} className="hover:text-orange-500 transition-colors">
                  {CONTACT_INFO.supplier}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-orange-500" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-orange-500 transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MessageCircle className="w-4 h-4 text-orange-500" />
                <a 
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500 transition-colors"
                >
                  WhatsApp: {CONTACT_INFO.whatsapp}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Import depuis États-Unis & Canada</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-3">Suivez-nous</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-700 hover:bg-green-900 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Icon className="w-5 h-5 text-gray-300 group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-orange-500 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-orange-500 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-orange-500 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-orange-500 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-400">
                © 2024 FastDeal Import. Tous droits réservés. 
                <span className="ml-2 flex items-center justify-center lg:justify-start mt-1 lg:mt-0 lg:inline">
                  <span>Fait avec</span>
                  <CheckCircle className="w-4 h-4 mx-1 text-green-500" />
                  <span>pour l'Afrique de l'Ouest</span>
                </span>
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm text-gray-400">Paiement sécurisé :</span>
              <div className="flex items-center space-x-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="w-10 h-6 bg-white rounded flex items-center justify-center"
                    title={method.name}
                  >
                    <span className="text-xs font-bold text-gray-800">
                      {method.icon}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <span className="text-sm">Haut de page</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;