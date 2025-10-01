'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Shield, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Message envoyé avec succès !');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'contact@fastdeal.fr',
      description: 'Réponse sous 24h',
      color: 'from-green-900 to-green-800'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: '+1(206)756-9764',
      description: 'Lun-Ven 9h-18h',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: 'new york, 10 rue de la paix',
      description: 'ny 10001, USA',
      color: 'from-green-900 to-green-800'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: 'Lundi - Vendredi',
      description: '9h00 - 18h00',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const supportTopics = [
    {
      icon: Shield,
      title: 'Support Technique',
      description: 'Problèmes avec un produit ou besoin d\'aide technique',
      email: 'support@fastdeal.fr'
    },
    {
      icon: Truck,
      title: 'Livraison & Retours',
      description: 'Questions sur les livraisons, retours et remboursements',
      email: 'livraison@fastdeal.fr'
    },
    {
      icon: MessageCircle,
      title: 'Service Client',
      description: 'Questions générales et assistance personnalisée',
      email: 'client@fastdeal.fr'
    }
  ];

  const faqItems = [
    {
      question: 'Comment puis-je suivre ma commande ?',
      answer: 'Vous recevrez un email de confirmation avec un lien de suivi dès l\'expédition de votre commande.'
    },
    {
      question: 'Quelle est votre politique de retour ?',
      answer: 'Vous disposez de 14 jours pour retourner un produit sans justification, avec remboursement intégral.'
    },
    {
      question: 'Les produits sont-ils garantis ?',
      answer: 'Tous nos produits reconditionnés bénéficient d\'une garantie de 12 mois minimum.'
    },
    {
      question: 'Comment vendre mes produits ?',
      answer: 'Créez un compte, ajoutez vos produits avec photos et descriptions, nous nous occupons du reste.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Notre équipe est là pour vous accompagner dans votre expérience 
              <span className="text-orange-400 font-semibold"> FastDeal</span>
            </p>
            <div className="inline-flex items-center bg-green-800/50 backdrop-blur-sm px-6 py-3 rounded-full text-green-100 border border-green-600/30">
              <MessageCircle className="w-5 h-5 mr-2 text-orange-400" />
              Support disponible 7j/7
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600 mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Sujet *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900"
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="support">Support technique</option>
                    <option value="livraison">Livraison & Retours</option>
                    <option value="general">Question générale</option>
                    <option value="vente">Vendre mes produits</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-900/20 focus:border-green-900 resize-none"
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-900 to-green-800 text-white py-4 rounded-xl hover:from-green-800 hover:to-green-700 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Nos Coordonnées
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{info.title}</h4>
                        <p className="text-gray-700 font-medium">{info.details}</p>
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support Topics */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Support Spécialisé
              </h3>
              <div className="space-y-4">
                {supportTopics.map((topic, index) => {
                  const Icon = topic.icon;
                  return (
                    <div key={index} className="border border-gray-100 rounded-xl p-4 hover:border-green-200 transition-colors">
                      <div className="flex items-start space-x-3">
                        <Icon className={`w-6 h-6 mt-1 ${index % 2 === 0 ? 'text-green-900' : 'text-orange-500'}`} />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{topic.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                          <a
                            href={`mailto:${topic.email}`}
                            className="text-sm text-green-900 hover:text-green-700 font-medium"
                          >
                            {topic.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-green-900 to-green-800 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d'une assistance immédiate ?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Notre chat en direct est disponible pour vous aider instantanément
          </p>
          <button className="bg-white text-green-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-xl hover:scale-105">
            Démarrer le chat
          </button>
        </div>
      </div>
    </div>
  );
}